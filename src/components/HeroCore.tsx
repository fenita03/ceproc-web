import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import lockupReverseUrl from "../brand/ceproc-lockup-reverse.svg";
import { areas } from "../content/ceproc";
import { heroAreas } from "../content/heroAreas";
import { useNarrow, useReducedMotion } from "../hooks/media";
import { CORE_R, NODE_ORBIT, NODE_PHASE, ORBITS } from "./three/orbitLayout";
import styles from "./HeroCore.module.css";

type Orbit = Awaited<ReturnType<typeof import("./three/orbitCore").createOrbitCore>>;
type Mode = "pending" | "3d" | "flat";

const N = heroAreas.length;
const totalWorkshops = areas.reduce((n, a) => n + a.workshops.length, 0);
/** Radio de imantación del cursor hacia un nodo (fracción del ancho del núcleo). */
const MAGNET = 0.16;
/** Para cambiar de área, el nodo nuevo debe estar claramente más cerca que el actual. */
const HYSTERESIS = 0.72;
/** Espera antes de volver al reposo al alejarse: evita parpadeos en el borde. */
const LEAVE_MS = 180;

function openCatalogue(id: string) {
  const d = document.getElementById(`catalogo-${id}`) as HTMLDetailsElement | null;
  if (!d) return;
  d.open = true;
  d.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Posiciones de la versión plana (proyección ortográfica de la misma disposición orbital). */
const FLAT = (() => {
  const W = 3.1;
  const H = 2.0;
  const pts = NODE_ORBIT.map((o, i) => {
    const orb = ORBITS[o];
    const a = NODE_PHASE[i];
    const x0 = Math.cos(a) * orb.r;
    const y0 = Math.sin(a) * orb.r * Math.cos(orb.tiltX);
    const x = x0 * Math.cos(orb.tiltZ) - y0 * Math.sin(orb.tiltZ);
    const y = x0 * Math.sin(orb.tiltZ) + y0 * Math.cos(orb.tiltZ);
    return { x: (x + W / 2) / W, y: (-y + H / 2) / H };
  });
  return { W, H, pts };
})();

const sideOf = (x: number) => (x > 0.8 ? "above-end" : x < 0.2 ? "above-start" : x < 0.5 ? "left" : "right");

/**
 * Núcleo interactivo de la portada: el logo de CEPROC con las siete áreas en órbita.
 * Acercar el cursor a un área la selecciona; clic o Enter la fija; Escape la suelta; en
 * pantallas táctiles se elige con la fila de botones. `onActive` informa el área visible
 * (o null en reposo) para que la portada cambie su fondo.
 */
export function HeroCore({ onActive }: { onActive: (i: number | null) => void }) {
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const orbitRef = useRef<Orbit | null>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [kbd, setKbd] = useState<number | null>(null);
  const leaveTimer = useRef(0);
  const shown = hover ?? kbd ?? pinned;

  useEffect(() => {
    orbitRef.current?.setActive(shown);
    onActive(shown);
  }, [shown, onActive]);

  // --- escena 3D (una sola vez; la selección nunca la reconstruye) ---
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      await new Promise<void>((r) =>
        "requestIdleCallback" in window ? requestIdleCallback(() => r(), { timeout: 900 }) : setTimeout(r, 200),
      );
      if (disposed) return;
      const mod = await import("./three/orbitCore");
      if (disposed) return;
      if (!webgl()) {
        setMode("flat");
        return;
      }
      let orbit: Orbit;
      try {
        orbit = await mod.createOrbitCore(canvasRef.current!, {
          mobile: window.matchMedia("(max-width: 860px)").matches,
          reduced,
        });
      } catch (err) {
        console.error("No se pudo iniciar el núcleo 3D; se muestra la versión plana.", err);
        setMode("flat");
        return;
      }
      if (disposed) {
        orbit.dispose();
        return;
      }
      orbitRef.current = orbit;
      orbit.onFrame((pts) => {
        pts.forEach((p, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
          el.dataset.side = p.side;
          el.dataset.behind = p.behind ? "true" : "false";
        });
      });
      orbit.start();
      setMode("3d");
      (window as unknown as { __ceprocOrbit?: Orbit }).__ceprocOrbit = orbit;

      const io = new IntersectionObserver(([e]) => orbit.setVisible(e.isIntersecting));
      io.observe(wrapRef.current!);
      const ro = new ResizeObserver(() => orbit.resize());
      ro.observe(canvasRef.current!);
      const onVis = () => orbit.setVisible(!document.hidden);
      document.addEventListener("visibilitychange", onVis);
      cleanup = () => {
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        orbitRef.current = null;
        orbit.dispose();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduced]);

  // Rótulos en posición fija mientras no hay 3D (versión plana).
  useEffect(() => {
    if (mode === "3d") return;
    const place = () => {
      const w = wrapRef.current?.clientWidth ?? 0;
      const h = wrapRef.current?.clientHeight ?? 0;
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate(${(FLAT.pts[i].x * w).toFixed(1)}px, ${(FLAT.pts[i].y * h).toFixed(1)}px)`;
        el.dataset.side = sideOf(FLAT.pts[i].x);
        el.dataset.behind = "false";
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(wrapRef.current!);
    return () => ro.disconnect();
  }, [mode]);

  // --- selección con el puntero: nodo más cercano, con imán e histéresis ---
  function nearest(clientX: number, clientY: number) {
    const o = orbitRef.current;
    if (o) return o.nearest(clientX, clientY);
    const r = wrapRef.current!.getBoundingClientRect();
    const dists = FLAT.pts.map((p) => Math.hypot(r.left + p.x * r.width - clientX, r.top + p.y * r.height - clientY));
    let index = 0;
    dists.forEach((d, i) => d < dists[index] && (index = i));
    return { index, dist: dists[index], dists };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const r = wrapRef.current!.getBoundingClientRect();
    orbitRef.current?.point((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    // Sobre un rótulo manda el rótulo (aunque el cursor quede más cerca de otro nodo).
    const tab = (e.target as Element).closest<HTMLElement>("[data-index]");
    if (tab) {
      window.clearTimeout(leaveTimer.current);
      setHover(Number(tab.dataset.index));
      return;
    }
    const n = nearest(e.clientX, e.clientY);
    const magnet = r.width * MAGNET;
    setHover((cur) => {
      if (cur !== null && n.dists[cur] < magnet * 1.25 && n.index !== cur && n.dist > n.dists[cur] * HYSTERESIS) return cur;
      if (n.dist <= magnet) return n.index;
      return cur;
    });
    if (n.dist <= magnet * 1.25) window.clearTimeout(leaveTimer.current);
    else scheduleLeave();
  }

  function scheduleLeave() {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHover(null), LEAVE_MS);
  }

  function onPointerLeave() {
    orbitRef.current?.point(0, 0);
    scheduleLeave();
  }

  function onClick(e: React.MouseEvent) {
    const r = wrapRef.current!.getBoundingClientRect();
    const n = nearest(e.clientX, e.clientY);
    if (n.dist <= r.width * MAGNET) togglePin(n.index);
  }

  function togglePin(i: number) {
    setPinned((v) => (v === i ? null : i));
  }

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  // --- teclado (lista de pestañas con foco itinerante) ---
  const tabs = useMemo(() => heroAreas.map((a) => a.id), []);
  const focusIndex = kbd ?? pinned ?? 0;
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % N;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + N) % N;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = N - 1;
    else if (e.key === "Escape") {
      setPinned(null);
      setKbd(null);
      return;
    }
    if (next < 0) return;
    e.preventDefault();
    setKbd(next);
    document.getElementById(`hero-area-${tabs[next]}`)?.focus();
  }

  const info = shown === null ? null : heroAreas[shown];

  return (
    <div className={styles.core} data-mode={mode} data-active={shown ?? "none"}>
      <div ref={wrapRef} className={styles.orbit} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} onClick={onClick}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <FlatOrbit active={shown} />
        {/* Logo de CEPROC en el centro: plano y chico, la misma versión que la cabecera. */}
        <img className={styles.centerLogo} src={lockupReverseUrl} alt="" width={280} height={120} aria-hidden="true" />
        <div
          className={styles.labels}
          role="tablist"
          aria-label="Áreas de formación"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setKbd(null);
          }}
        >
          {heroAreas.map((a, i) => (
            <button
              key={a.id}
              id={`hero-area-${a.id}`}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              className={styles.label}
              aria-selected={shown === i}
              aria-pressed={pinned === i}
              aria-controls="hero-area-panel"
              tabIndex={i === focusIndex ? 0 : -1}
              data-on={shown === i || undefined}
              data-index={i}
              onFocus={(e) => {
                // Solo el foco de teclado selecciona (un clic ya fija el área por su cuenta).
                if (e.currentTarget.matches(":focus-visible")) setKbd(i);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
              onClick={(e) => {
                e.stopPropagation();
                togglePin(i);
              }}
            >
              <span className={styles.labelText}>
                <span className={styles.num}>{a.num}</span>
                <span className={styles.name}>{a.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {narrow && (
        <div className={styles.chips} role="group" aria-label="Elegí un área">
          {heroAreas.map((a, i) => (
            <button
              key={a.id}
              type="button"
              className={styles.chip}
              aria-pressed={shown === i}
              onClick={() => {
                setPinned(i);
                setHover(null);
              }}
            >
              <span className={styles.num}>{a.num}</span>
              {a.label}
            </button>
          ))}
        </div>
      )}

      <div id="hero-area-panel" className={styles.panel} role="tabpanel" aria-live="polite">
        {info ? (
          <div key={info.id} className={styles.panelIn}>
            {narrow && (
              <figure className={styles.photo}>
                <img src={info.photo.small} alt={info.alt} width={640} height={Math.round(640 / info.photo.aspect)} decoding="async" />
              </figure>
            )}
            <p className={`eyebrow ${styles.meta}`}>
              <span className={styles.metaNum}>Área {info.num}</span> {info.section} · {info.count} talleres
            </p>
            <p className={styles.title}>{info.title}</p>
            <p className={styles.summary}>{info.short}</p>
            <a
              href={`#catalogo-${info.id}`}
              className={styles.more}
              onClick={(e) => {
                e.preventDefault();
                openCatalogue(info.id);
              }}
            >
              Ver los {info.count} talleres
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        ) : (
          <div key="idle" className={styles.panelIn}>
            <p className={`eyebrow ${styles.meta}`}>
              {N} áreas · {totalWorkshops} talleres propuestos
            </p>
            <p className={styles.title}>Elegí un área de formación</p>
            <p className={styles.summary}>
              {narrow
                ? "Tocá un área para ver qué se aprende en ella."
                : "Acercá el cursor a un área del núcleo o recorrelas con el teclado para ver qué se aprende en cada una."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Versión plana (mientras carga el 3D o sin WebGL): la misma disposición orbital en SVG. */
function FlatOrbit({ active }: { active: number | null }) {
  const { W, H, pts } = FLAT;
  const p = active === null ? null : pts[active];
  let link = null;
  if (p) {
    const x = p.x * W - W / 2;
    const y = p.y * H - H / 2;
    const d = Math.hypot(x, y) || 1;
    link = <line x1={(x / d) * CORE_R} y1={(y / d) * CORE_R} x2={x} y2={y} className={styles.flatLink} />;
  }
  return (
    <svg className={styles.flat} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} aria-hidden="true">
      {ORBITS.map((o, i) => (
        <ellipse
          key={i}
          rx={o.r}
          ry={o.r * Math.abs(Math.cos(o.tiltX))}
          transform={`rotate(${(-o.tiltZ * 180) / Math.PI})`}
          className={i === 1 ? styles.flatOrbitDash : styles.flatOrbitLine}
        />
      ))}
      {link}
      {pts.map((q, i) => (
        <circle key={i} cx={q.x * W - W / 2} cy={q.y * H - H / 2} r={active === i ? 0.034 : 0.022} className={active === i ? styles.flatNodeOn : styles.flatNode} />
      ))}
    </svg>
  );
}

function webgl() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}
