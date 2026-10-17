import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { HeroCore } from "../components/HeroCore";
import { openEnroll } from "../hooks/enroll";
import { areas, institution } from "../content/ceproc";
import { heroAreas } from "../content/heroAreas";
import { photo } from "../content/photos";
import { useNarrow, useReducedMotion } from "../hooks/media";
import strataUrl from "../brand/estratos.svg";
import styles from "./Hero.module.css";

const totalWorkshops = areas.reduce((n, a) => n + a.workshops.length, 0);
const landscape = photo("paisaje");
// En celulares el fondo va detrás de un velo oscuro: basta una imagen liviana.
const SIZES = "(max-width: 860px) 60vw, 100vw";

export function Hero() {
  const [active, setActive] = useState<number | null>(null);
  const onActive = useCallback((i: number | null) => setActive(i), []);
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title" data-active={active ?? "none"}>
      <Backdrop active={active} />
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.in} ${styles.kicker}`} style={{ "--d": "120ms" } as React.CSSProperties}>
            <span>{institution.short}</span>
            <span className={styles.kickerRule} aria-hidden="true" />
            <span>Rawson, San Juan</span>
          </p>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line} style={{ "--i": 0 } as React.CSSProperties}>
              <span>Formación que</span>
            </span>
            <span className={styles.line} style={{ "--i": 1 } as React.CSSProperties}>
              <span>construye futuro.</span>
            </span>
          </h1>
          <p className={`${styles.in} ${styles.lead}`} style={{ "--d": "520ms" } as React.CSSProperties}>
            <strong className={styles.name}>{institution.name}.</strong> Formación práctica en oficios para jóvenes y
            adultos de Rawson, conectada con el trabajo.
          </p>
          <div className={`${styles.in} ${styles.actions}`} style={{ "--d": "620ms" } as React.CSSProperties}>
            <a href="#areas" className="btn btn-gold">
              Ver las capacitaciones
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <button type="button" className="btn btn-ghost" onClick={() => openEnroll()}>
              <GraduationCap size={18} aria-hidden="true" />
              Capacitate con nosotros
            </button>
          </div>
        </div>

        {/* Núcleo 3D: las siete áreas en órbita alrededor del logo de CEPROC. */}
        <div className={`${styles.stageIn} ${styles.stage}`}>
          <p className={`eyebrow ${styles.coords}`} aria-hidden="true">
            31°34′ S · 68°32′ O
          </p>
          <HeroCore onActive={onActive} />
        </div>

        <div className={styles.facts}>
          <dl className={styles.factsList}>
          <div className={styles.in} style={{ "--d": "760ms" } as React.CSSProperties}>
            <dt>Áreas de formación</dt>
            <dd>{String(areas.length).padStart(2, "0")}</dd>
          </div>
          <div className={styles.in} style={{ "--d": "820ms" } as React.CSSProperties}>
            <dt>Talleres propuestos</dt>
            <dd>{totalWorkshops}</dd>
          </div>
          <div className={styles.in} style={{ "--d": "880ms" } as React.CSSProperties}>
            <dt>Departamento · San Juan</dt>
            <dd className={styles.place}>Rawson</dd>
          </div>
          </dl>
          <div className={`${styles.in} ${styles.factLink}`} style={{ "--d": "940ms" } as React.CSSProperties}>
            <a href="#areas" className={styles.scroll}>
              <span>Recorrer las áreas</span>
              <span className={styles.scrollIcon}>
                <ArrowDown size={16} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Fondo: paisaje de San Juan con parallax moderado (scroll y cursor), bruma lenta y luz cálida.
 * Al elegir un área en el núcleo, su fotografía toma la escena con un fundido corto.
 */
function Backdrop({ active: activeIn }: { active: number | null }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // En celulares el fondo queda fijo (paisaje): la foto del área se muestra en la ficha.
  const narrow = useNarrow();
  const active = narrow ? null : activeIn;
  const [warm, setWarm] = useState(false);
  const [width, setWidth] = useState(1600);
  // Solo la imagen activa y la que se desvanece quedan visibles (menos capas para la GPU).
  const [prev, setPrev] = useState<number | null | undefined>(undefined);
  const last = useRef<number | null>(active);
  useEffect(() => {
    if (last.current === active) return;
    setPrev(last.current);
    last.current = active;
    const t = window.setTimeout(() => setPrev(undefined), 420);
    return () => window.clearTimeout(t);
  }, [active]);
  const state = (i: number | null) => (active === i ? "on" : prev === i ? "out" : "off");

  // Tras la carga inicial se descargan y decodifican las fotos de las áreas (sin bloquear nada).
  useEffect(() => {
    if (narrow) return;
    const go = () => {
      const w = innerWidth * Math.min(devicePixelRatio, 2) > 1300 ? 1600 : 1080;
      setWidth(w);
      heroAreas.reduce(
        (chain, a) =>
          chain.then(() => {
            const im = new Image();
            im.src = a.photo.src.replace("-1600.", `-${w}.`);
            return im.decode().catch(() => undefined);
          }),
        Promise.resolve() as Promise<unknown>,
      );
      setWarm(true);
    };
    const idle = () =>
      "requestIdleCallback" in window ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  }, [narrow]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el || reduced) return;
    const hero = el.closest("section")!;
    const s = { x: 0, y: 0, tx: 0, ty: 0, scroll: 0, raf: 0, visible: true };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // El ciclo solo corre mientras hay movimiento pendiente y la portada está en pantalla.
    const tick = () => {
      s.raf = 0;
      s.x += (s.tx - s.x) * 0.08;
      s.y += (s.ty - s.y) * 0.08;
      el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${(s.y + s.scroll * 0.28).toFixed(2)}px, 0)`;
      if (Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05) s.raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!s.raf && s.visible) s.raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      s.tx = (e.clientX / innerWidth - 0.5) * -16;
      s.ty = (e.clientY / innerHeight - 0.5) * -8;
      kick();
    };
    const onScroll = () => {
      s.scroll = Math.min(scrollY, innerHeight);
      kick();
    };
    const io = new IntersectionObserver(([e]) => (s.visible = e.isIntersecting));
    io.observe(hero);
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(s.raf);
    };
  }, [reduced]);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.settle}>
      <div ref={sceneRef} className={styles.scene}>
        <img
          className={styles.bg}
          data-on={active === null || undefined}
          data-state={state(null)}
          src="/img/paisaje-1600.webp"
          srcSet={landscape.srcSet}
          sizes={SIZES}
          alt=""
          fetchPriority="high"
          style={{ objectPosition: `${landscape.focus[0] * 100}% ${landscape.focus[1] * 100}%` }}
        />
        {/* Fotos de áreas como fondos CSS: no compiten como «contenido más grande» (LCP). */}
        {!narrow &&
          warm &&
          heroAreas.map((a, i) => (
            <div
              key={a.id}
              className={styles.bg}
              data-on={active === i || undefined}
              data-state={state(i)}
              style={{
                backgroundImage: `url(${a.photo.src.replace("-1600.", `-${width}.`)})`,
                backgroundPosition: `${a.photo.focus[0] * 100}% ${a.photo.focus[1] * 100}%`,
              }}
            />
          ))}
      </div>
      </div>
      <span className={styles.glow} />
      <span className={`${styles.haze} ${styles.hazeA}`} />
      <span className={`${styles.haze} ${styles.hazeB}`} />
      <span className={styles.shade} />
      <span className={`strata ${styles.strata}`}>
        <img src={strataUrl} alt="" />
      </span>
    </div>
  );
}
