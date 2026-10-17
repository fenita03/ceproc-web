import { useEffect, useRef, useState } from "react";
import { project } from "../content/ceproc";
import { useReducedMotion } from "../hooks/media";
import styles from "./Pathway.module.css";

/**
 * Circuito de vinculación (p. 14 del proyecto): capacitación → evaluación → certificación
 * → presentación del perfil → selección laboral. Los pasos se encienden al recorrer la sección.
 * La barra se mueve escribiendo una variable CSS; React solo se actualiza al encender un paso.
 */
export function Pathway() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const steps = project.pathway;
  const [lit, setLit] = useState(reduced ? steps.length : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty("--p", "1");
      setLit(steps.length);
      return;
    }
    let frame = 0;
    let visible = false;
    let last = "";
    const read = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // 0 cuando el bloque entra por abajo; 1 cuando su centro pasa el 40 % superior.
      const p = Math.min(1, Math.max(0, (innerHeight * 0.92 - r.top) / (innerHeight * 0.52 + r.height * 0.5)));
      const v = p.toFixed(3);
      if (v !== last) el.style.setProperty("--p", (last = v));
      const n = Math.floor(p * (steps.length - 1) + 0.15) + 1;
      setLit((prev) => (prev === n ? prev : n));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(read);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      onScroll();
    });
    io.observe(el);
    addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced, steps.length]);

  return (
    <section className={styles.pathway} aria-labelledby="circuito-title">
      <h3 id="circuito-title" className={styles.title}>
        Puente hacia el trabajo formal
      </h3>
      <div ref={ref} className={styles.track}>
        <span className={styles.rail} aria-hidden="true">
          <span className={styles.fill} />
        </span>
        <ol>
          {steps.map((s, i) => (
            <li key={s.step} data-on={i < lit} data-current={i === lit - 1 || undefined}>
              <span className={styles.node} aria-hidden="true" />
              <p className={styles.num} aria-hidden="true">
                Etapa {String(i + 1).padStart(2, "0")}
              </p>
              <p className={styles.step}>{s.step}</p>
              <p className={styles.text}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.note}>{project.pathwayNote}</p>
    </section>
  );
}
