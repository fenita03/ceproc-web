import { ArrowDown } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { ArrowLeft } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { useReducedMotion } from "../hooks/media";
import { AREA_EVENT, openEnroll } from "../hooks/enroll";
import { areas } from "../content/ceproc";
import fotos from "../content/talleres-fotos.json";
import styles from "./Areas.module.css";

type Foto = { file: string; alt: string; src: string; srcSet: string; truck?: boolean };
const fotosDe = (id: string): Foto[] =>
  id === TRUCK_AREA
    ? TRUCK
    : ((fotos as Record<string, { file: string; alt: string }[]>)[id] ?? []).map((f) => ({
        ...f,
        src: `${f.file}-1280.webp`,
        srcSet: `${f.file}-640.webp 640w, ${f.file}-1280.webp 1280w`,
      }));

/**
 * Maquinaria y mecánica: las tarjetas muestran las vistas del camión minero (una por taller,
 * recorriéndolo de frente a atrás) y el carrusel avanza solo, despacio.
 */
const TRUCK_AREA = "mineros-1";
const TRUCK: Foto[] = [
  [1, "vista frontal"],
  [3, "vista de tres cuartos delantera"],
  [5, "vista de perfil"],
  [6, "vista de tres cuartos trasera"],
  [7, "vista trasera lateral"],
].map(([v, desc]) => ({
  file: `/img/camion/vista-${v}`,
  alt: `Camión minero de gran porte, ${desc}`,
  src: `/img/camion/vista-${v}-1280.webp`,
  srcSet: `/img/camion/vista-${v}-1280.webp 1280w, /img/camion/vista-${v}-1920.webp 1920w`,
  truck: true,
}));
const AUTO_MS = 5000; // tiempo de cada tarjeta en el avance automático
const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Áreas de formación (formato de vitrina): pestañas de área arriba; a la izquierda la ficha del
 * área y la lista de talleres; a la derecha un carrusel 3D con una tarjeta por taller.
 * Clic o toque en un taller, flechas, guiones o deslizar cambian la tarjeta central.
 */
export function Areas() {
  const [ai, setAi] = useState(0);
  const [wi, setWi] = useState(0);
  // glide: el último cambio fue automático (giro más largo y suave que el de un clic).
  const [glide, setGlide] = useState(false);
  const reduced = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);
  const hover = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const markRef = useRef<HTMLSpanElement>(null);
  const area = areas[ai];
  const list = area.workshops;
  const pics = fotosDe(area.id);
  const n = list.length;

  const auto = area.id === TRUCK_AREA && !reduced;

  // Indicador de la pestaña activa: un hilo dorado que se desliza (solo transform).
  useLayoutEffect(() => {
    const place = () => {
      const t = tabRefs.current[ai];
      const m = markRef.current;
      if (!t || !m) return;
      m.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth})`;
    };
    place();
    const parent = tabRefs.current[ai]?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(place);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [ai]);

  const pick = (i: number) => {
    setGlide(false);
    setWi(i);
  };
  const pickArea = (i: number) => {
    setAi(i);
    pick(0);
  };
  const go = (d: number) => {
    setGlide(false);
    setWi((w) => (w + d + n) % n);
  };

  // Otras secciones pueden pedir un área (p. ej. «Seguridad» lleva a las áreas mineras).
  useEffect(() => {
    const onArea = (e: Event) => {
      const i = areas.findIndex((a) => a.id === (e as CustomEvent<string>).detail);
      if (i >= 0) {
        setAi(i);
        setGlide(false);
        setWi(0);
      }
    };
    window.addEventListener(AREA_EVENT, onArea);
    return () => window.removeEventListener(AREA_EVENT, onArea);
  }, []);

  // Avance automático: solo con el carrusel en pantalla, la pestaña visible y sin el cursor
  // o el foco encima. Cada cambio (automático o manual) reinicia la cuenta.
  useEffect(() => {
    const el = carouselRef.current;
    if (!auto || !el) return;
    let visible = false;
    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      if (visible && !hover.current && !document.hidden)
        timer = window.setTimeout(() => {
          setGlide(true);
          setWi((w) => (w + 1) % n);
        }, AUTO_MS);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        schedule();
      },
      { threshold: 0.4 },
    );
    const hold = () => {
      hover.current = true;
      clearTimeout(timer);
    };
    const free = () => {
      hover.current = false;
      schedule();
    };
    io.observe(el);
    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", free);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", free);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      io.disconnect();
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", free);
      el.removeEventListener("focusin", hold);
      el.removeEventListener("focusout", free);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [auto, n, wi]);

  const onTabsKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k: Record<string, (i: number) => number> = {
      ArrowRight: (i) => (i + 1) % areas.length,
      ArrowLeft: (i) => (i - 1 + areas.length) % areas.length,
      Home: () => 0,
      End: () => areas.length - 1,
    };
    if (!(e.key in k)) return;
    e.preventDefault();
    const next = k[e.key](ai);
    pickArea(next);
    tabRefs.current[next]?.focus();
  };

  // Deslizar en pantallas táctiles (o arrastrar con el mouse) cambia de taller.
  const drag = useRef<{ x: number; id: number } | null>(null);
  const onDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onUp = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  const openCatalogue = () => {
    const el = document.getElementById(`catalogo-${area.id}`) as HTMLDetailsElement | null;
    if (el) {
      el.open = true;
      el.scrollIntoView({ block: "start" });
      el.querySelector("summary")?.focus({ preventScroll: true });
    }
  };

  return (
    <section id="areas" className={styles.section} aria-labelledby="areas-title">
      <div className="wrap">
        <div className={styles.head} data-reveal>
          <div>
            <p className="index">
              <b>01</b> {areas.length} áreas · {areas.reduce((t, a) => t + a.workshops.length, 0)} talleres
            </p>
            <h2 id="areas-title" className={styles.title}>
              Capacitaciones
            </h2>
          </div>
          <p className={styles.intro}>
            Elegí un área, recorré sus talleres y, si uno te interesa, dejanos tus datos. Son los talleres propuestos por
            CEPROC, hoy en etapa de presentación.
          </p>
        </div>

        <div role="tablist" aria-label="Áreas de formación" className={styles.tabs} onKeyDown={onTabsKey}>
          {areas.map((a, i) => (
            <button
              key={a.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${a.id}`}
              type="button"
              role="tab"
              aria-selected={i === ai}
              aria-controls="area-panel"
              tabIndex={i === ai ? 0 : -1}
              className={styles.tab}
              onClick={() => pickArea(i)}
            >
              <span className={styles.tabNum} aria-hidden="true">
                {num(i)}
              </span>
              <span className={styles.tabLabel}>{a.label}</span>
            </button>
          ))}
          <span ref={markRef} className={styles.tabMark} aria-hidden="true" />
        </div>

        <div id="area-panel" role="tabpanel" aria-labelledby={`tab-${area.id}`} className={styles.stage}>
          <div className={styles.info} key={area.id}>
            <p className={`eyebrow ${styles.areaMeta}`}>
              <span className={styles.areaNum}>Área {num(ai)}</span> {area.section}
            </p>
            <h3 className={styles.areaTitle}>{area.label}</h3>
            <p className={styles.areaLead}>{area.title}</p>
            <blockquote className={styles.quote}>
              <p className={styles.quoteLabel}>Qué propone</p>
              <p>{area.summary}</p>
            </blockquote>

            <p className={styles.listLabel}>{n} talleres · tocá uno para verlo</p>
            <ul className={styles.wlist}>
              {list.map((w, i) => (
                <li key={w.name}>
                  <button type="button" className={styles.witem} aria-pressed={i === wi} onClick={() => pick(i)}>
                    <span className={styles.wname}>{w.name}</span>
                    {i === wi && <span className={styles.wgoal}>{w.goal}</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.more}>
              <button type="button" className="btn btn-gold" onClick={() => openEnroll({ area: area.id, workshop: list[wi].name })}>
                <GraduationCap size={18} aria-hidden="true" />
                Me interesa este taller<span className="sr-only">: {list[wi].name}</span>
              </button>
              <button type="button" className="btn btn-ghost" onClick={openCatalogue}>
                Ver el catálogo completo del área
                <ArrowDown size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={styles.showcase}>
            <div
              ref={carouselRef}
              className={styles.carousel}
              data-glide={glide || undefined}
              onPointerDown={onDown}
              onPointerUp={onUp}
              onPointerCancel={() => (drag.current = null)}
              aria-roledescription="carrusel"
              aria-label={`Talleres de ${area.label}`}
            >
              {list.map((w, i) => {
                let off = i - wi;
                if (off > n / 2) off -= n;
                if (off < -n / 2) off += n;
                const near = Math.abs(off) <= 1;
                const pic = pics[i];
                return (
                  <article
                    key={`${area.id}-${i}`}
                    className={styles.card}
                    data-off={Math.max(-2, Math.min(2, off))}
                    data-truck={pic?.truck || undefined}
                    aria-hidden={off !== 0}
                    onClick={() => off !== 0 && pick(i)}
                  >
                    <div className={styles.screen}>
                      <div className={styles.cardMedia}>
                        {pic && near && (
                          <img
                            src={pic.src}
                            srcSet={pic.srcSet}
                            sizes="(max-width: 1000px) 80vw, 30vw"
                            width={1280}
                            height={960}
                            alt={off === 0 ? pic.alt || w.name : ""}
                            decoding="async"
                            draggable={false}
                          />
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <p className={`eyebrow ${styles.cardNum}`}>
                          Taller {num(i)} / {num(n - 1)}
                        </p>
                        <p className={styles.cardName}>{w.name}</p>
                        <p className={styles.cardGoal}>{w.goal}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.controls}>
              <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Taller anterior">
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <div className={styles.dots} role="group" aria-label="Elegir taller">
                {list.map((w, i) => (
                  <button
                    key={w.name}
                    type="button"
                    className={styles.dotBtn}
                    aria-label={w.name}
                    aria-current={i === wi || undefined}
                    onClick={() => pick(i)}
                  />
                ))}
              </div>
              <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Taller siguiente">
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            <p className={styles.caption} aria-live="polite">
              {list[wi].name}
            </p>
          </div>
        </div>

        <Catalogue />
      </div>
    </section>
  );
}

function Catalogue() {
  return (
    <section className={styles.catalogue} aria-labelledby="catalogo-title">
      <h3 id="catalogo-title" className={styles.catTitle} data-reveal>
        Todos los talleres, área por área
      </h3>
      <div className={styles.accordion}>
        {areas.map((a, i) => (
          <details key={a.id} id={`catalogo-${a.id}`} className={styles.item}>
            <summary>
              <span className={styles.itemNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.itemTitle}>
                {a.title}
                <span className={styles.itemMeta}>
                  {a.section} · {a.workshops.length} talleres
                </span>
              </span>
              <span className={styles.plus} aria-hidden="true" />
            </summary>
            <div className={styles.itemBody}>
              <table className={styles.table}>
                <caption className="sr-only">Talleres de {a.title}</caption>
                <thead>
                  <tr>
                    <th scope="col">Taller</th>
                    <th scope="col">Objetivo específico</th>
                  </tr>
                </thead>
                <tbody>
                  {a.workshops.map((w) => (
                    <tr key={w.name}>
                      <th scope="row">{w.name}</th>
                      <td>{w.goal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {a.extra && (
                <div className={styles.extra}>
                  <p className={styles.extraTitle}>{a.extraTitle}</p>
                  <ul>
                    {a.extra.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {a.note && <p className={styles.note}>{a.note}</p>}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
