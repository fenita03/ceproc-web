import { useEffect, useRef } from "react";
import { areas } from "../content/ceproc";
import { photo } from "../content/photos";
import { useReducedMotion } from "../hooks/media";
import styles from "./Mosaic.module.css";

/** Tres oficios del proyecto, de la mina al telar y al taller de madera. */
const TILES = [0, 4, 6].map((i) => ({ area: areas[i], num: String(i + 1).padStart(2, "0"), p: photo(areas[i].image) }));
/** Desplazamiento de cada foto con el scroll (px por cada pantalla recorrida): profundidad sutil. */
const DEPTH = [-40, 30, -22];

/**
 * Recorrido fotográfico de «La institución»: tres láminas escalonadas, cada una con su área y su
 * sección del documento. Entran con una cortina al aparecer y se desplazan a distinto ritmo con
 * el scroll (solo transform y clip-path; sin movimiento si se prefiere reducirlo).
 */
export function Mosaic() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.dataset.in = "true";
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    if (reduced) return () => io.disconnect();

    const imgs = [...el.querySelectorAll<HTMLElement>("[data-depth]")];
    let raf = 0;
    let visible = false;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // -1 cuando el recorrido entra por abajo, 0 en el centro, 1 cuando sale por arriba.
      const t = (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight;
      imgs.forEach((im) => (im.style.transform = `translate3d(0, ${(Number(im.dataset.depth) * t).toFixed(1)}px, 0) scale(1.14)`));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(read);
    };
    const vis = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      onScroll();
    });
    vis.observe(el);
    addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      io.disconnect();
      vis.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={styles.mosaic} aria-label="Algunos oficios del proyecto" role="group">
      {TILES.map(({ area, num, p }, i) => (
        <figure key={area.id} className={styles.tile} style={{ "--d": `${i * 140}ms` } as React.CSSProperties}>
          <div className={styles.frame}>
            <img
              src={p.src}
              srcSet={p.srcSet}
              sizes="(max-width: 960px) 90vw, 32vw"
              width={p.width}
              height={p.height}
              alt={area.imageAlt}
              loading="lazy"
              decoding="async"
              data-depth={DEPTH[i]}
              style={{ objectPosition: `${p.focus[0] * 100}% ${p.focus[1] * 100}%` }}
            />
          </div>
          <figcaption>
            <span className={styles.num}>{num}</span>
            <span>
              <span className={styles.label}>{area.label}</span>
              <span className={styles.section}>{area.section}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
