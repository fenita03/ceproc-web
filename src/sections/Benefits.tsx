import strataUrl from "../brand/estratos.svg";
import { benefits } from "../content/ceproc";
import styles from "./Benefits.module.css";

const GROUPS = [
  { id: "ben-rawson", title: "Para el Departamento Rawson", items: benefits.rawson },
  { id: "ben-personas", title: "Para las personas", items: benefits.people },
];

export function Benefits() {
  return (
    <section id="beneficios" className={styles.section} aria-labelledby="beneficios-title">
      <span className={`strata ${styles.strata}`} aria-hidden="true">
        <img src={strataUrl} alt="" />
      </span>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.head}>
          <p className="index" data-reveal>
            <b>06</b> Beneficios
          </p>
          <h2 id="beneficios-title" className={styles.title} data-reveal style={{ "--d": "60ms" } as React.CSSProperties}>
            Beneficios para Rawson, las familias y el sector productivo
          </h2>
        </div>
        <div className={styles.cols}>
          {GROUPS.map((g, gi) => (
            <section key={g.id} aria-labelledby={g.id} className={styles.group}>
              <div className={styles.groupHead} data-reveal style={{ "--d": `${gi * 80}ms` } as React.CSSProperties}>
                <span className={styles.count} aria-hidden="true">
                  {String(g.items.length).padStart(2, "0")}
                </span>
                <h3 id={g.id} className={styles.subtitle}>
                  {g.title}
                </h3>
              </div>
              <ul className={styles.list} data-reveal="stagger">
                {g.items.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
