import { about, project } from "../content/ceproc";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { Pathway } from "../components/Pathway";
import styles from "./Project.module.css";

export function Project() {
  return (
    <section id="el-proyecto" className={styles.section} aria-labelledby="proyecto-title">
      <div className="wrap">
        <div className={styles.head}>
          <div data-reveal>
            <h2 id="proyecto-title" className={styles.title}>
              El proyecto
            </h2>
            <p className={styles.statement}>{project.title}.</p>
          </div>
          <div className={styles.text} data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            {project.foundation.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <div className={styles.objective} data-reveal>
          <h3 className="sr-only">Objetivo general</h3>
          <p>{project.generalObjective}</p>
        </div>

        <Pathway />

        <section className={styles.audience} aria-labelledby="destinatarios-title" data-reveal>
          <h3 id="destinatarios-title" className={styles.subtitle}>
            A quiénes está dirigido
          </h3>
          <ul className={styles.list}>
            {project.audience.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>

        {/* Detalle del documento: disponible completo, pero plegado para no saturar la lectura. */}
        <details className={`disclosure ${styles.more}`}>
          <summary className="btn btn-ghost">
            Objetivos específicos, metodología y principios
            <Plus size={16} aria-hidden="true" className="disclosure-icon" />
          </summary>

          <section className={styles.specific} aria-labelledby="especificos-title">
            <h3 id="especificos-title" className={styles.subtitle}>
              Objetivos específicos
            </h3>
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
              <h3 id="metodologia-title" className={styles.subtitle}>
                Metodología
              </h3>
              <ul className={styles.list}>
                {project.methodology.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="principios-title">
              <h3 id="principios-title" className={styles.subtitle}>
                Principios de trabajo
              </h3>
              <ul className={styles.list}>
                {about.principles.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>
          </div>
        </details>
      </div>
    </section>
  );
}
