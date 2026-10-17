import { useEffect, useState } from "react";
import { about, project } from "../content/ceproc";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { Pathway } from "../components/Pathway";
import styles from "./Project.module.css";

/** Bloques del recorrido de lectura (el índice lateral sigue al que está en pantalla). */
const STEPS = [
  { id: "proyecto-fundamentacion", label: "Fundamentación" },
  { id: "proyecto-objetivo", label: "Objetivo general" },
  { id: "proyecto-circuito", label: "Circuito hacia el trabajo" },
  { id: "proyecto-destinatarios", label: "Destinatarios" },
  { id: "proyecto-detalle", label: "Objetivos y metodología" },
];

export function Project() {
  const [current, setCurrent] = useState(STEPS[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    STEPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const at = STEPS.findIndex((s) => s.id === current);

  return (
    <section id="el-proyecto" className={styles.section} aria-labelledby="proyecto-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="index" data-reveal>
            <b>04</b> El proyecto
          </p>
          <h2 id="proyecto-title" className={styles.title} data-reveal style={{ "--d": "60ms" } as React.CSSProperties}>
            {project.title}.
          </h2>
        </header>

        <div className={styles.layout}>
          <nav className={styles.aside} aria-label="Partes del proyecto">
            <ol style={{ "--at": at } as React.CSSProperties}>
              {STEPS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={current === s.id ? "step" : undefined} data-done={i < at || undefined}>
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.content}>
            <section id="proyecto-fundamentacion" className={styles.block} aria-labelledby="fund-title">
              <h3 id="fund-title" className={styles.blockTitle}>
                Fundamentación
              </h3>
              <div className={styles.text} data-reveal>
                {project.foundation.map((p, i) => (
                  <p key={p.slice(0, 24)} className={i === 0 ? styles.first : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </section>

            <section id="proyecto-objetivo" className={styles.block} aria-labelledby="objetivo-title">
              <h3 id="objetivo-title" className={styles.blockTitle}>
                Objetivo general
              </h3>
              <p className={styles.objective} data-reveal>
                {project.generalObjective}
              </p>
            </section>

            <div id="proyecto-circuito" className={styles.block}>
              <Pathway />
            </div>

            <section id="proyecto-destinatarios" className={styles.block} aria-labelledby="destinatarios-title">
              <h3 id="destinatarios-title" className={styles.blockTitle}>
                A quiénes está dirigido
              </h3>
              <ul className={`${styles.list} ${styles.two}`} data-reveal="stagger">
                {project.audience.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>

            {/* Detalle del documento: disponible completo, pero plegado para no saturar la lectura. */}
            <section id="proyecto-detalle" className={styles.block} aria-labelledby="detalle-title">
              <h3 id="detalle-title" className={styles.blockTitle}>
                Objetivos específicos y metodología
              </h3>
              <details className={`disclosure ${styles.more}`}>
                <summary className="btn btn-ghost">
                  Ver objetivos específicos, metodología y principios
                  <Plus size={16} aria-hidden="true" className="disclosure-icon" />
                </summary>

                <section className={styles.specific} aria-labelledby="especificos-title">
                  <h4 id="especificos-title" className={styles.subtitle}>
                    Objetivos específicos
                  </h4>
                  <ol>
                    {project.specificObjectives.map((o, i) => (
                      <li key={o}>
                        <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                        <p>{o}</p>
                      </li>
                    ))}
                  </ol>
                </section>

                <div className={styles.columns}>
                  <section aria-labelledby="metodologia-title">
                    <h4 id="metodologia-title" className={styles.subtitle}>
                      Metodología
                    </h4>
                    <ul className={styles.list}>
                      {project.methodology.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </section>
                  <section aria-labelledby="principios-title">
                    <h4 id="principios-title" className={styles.subtitle}>
                      Principios de trabajo
                    </h4>
                    <ul className={styles.list}>
                      {about.principles.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </details>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
