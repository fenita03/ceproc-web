import { benefits } from "../content/ceproc";
import styles from "./Benefits.module.css";

export function Benefits() {
  return (
    <section id="beneficios" className={`on-paper ${styles.section}`} aria-labelledby="beneficios-title">
      <div className="wrap">
        <h2 id="beneficios-title" className={styles.title} data-reveal>
          Beneficios para Rawson, las familias y el sector productivo
        </h2>
        <div className={styles.cols}>
          <section aria-labelledby="ben-rawson" data-reveal>
            <h3 id="ben-rawson" className={styles.subtitle}>
              Para el Departamento Rawson
            </h3>
            <ul className={styles.list}>
              {benefits.rawson.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="ben-personas" data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            <h3 id="ben-personas" className={styles.subtitle}>
              Para las personas
            </h3>
            <ul className={styles.list}>
              {benefits.people.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
