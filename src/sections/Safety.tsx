import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { areas, safety } from "../content/ceproc";
import { showArea } from "../hooks/enroll";
import styles from "./Safety.module.css";

export function Safety() {
  return (
    <section id="seguridad" className={`on-paper-2 ${styles.section}`} aria-labelledby="seguridad-title">
      <div className={`wrap ${styles.grid}`}>
        <div data-reveal>
          <h2 id="seguridad-title" className={styles.title}>
            {safety.title}
          </h2>
          <p className={styles.lead}>
            En las áreas mineras se priorizan la seguridad, el mantenimiento responsable, la prevención de riesgos y el
            respeto por los procedimientos del sector. {safety.employability}
          </p>
        </div>
        <div className={styles.lists}>
          <section aria-labelledby="transversales-title" data-reveal>
            <h3 id="transversales-title" className={styles.subtitle}>
              Competencias transversales
            </h3>
            <ul>
              {safety.transversal.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="trayectos-title" data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            <h3 id="trayectos-title" className={styles.subtitle}>
              Trayectos mineros propuestos
            </h3>
            <p className={styles.tracksText}>
              Los talleres mineros están en dos áreas de formación, con su objetivo y prácticas.
            </p>
            <ul className={styles.tracks}>
              {areas
                .filter((a) => a.id.startsWith("mineros"))
                .map((a) => (
                  <li key={a.id}>
                    <a
                      href="#areas"
                      onClick={(e) => {
                        e.preventDefault();
                        showArea(a.id);
                      }}
                    >
                      <span>
                        {a.label}
                        <span className={styles.trackMeta}>{a.workshops.length} talleres</span>
                      </span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
