import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { benefits, companies, municipality } from "../content/ceproc";
import styles from "./Articulation.module.css";

export function Articulation() {
  return (
    <section id="articulacion" className={`on-paper-2 ${styles.section}`} aria-labelledby="articulacion-title">
      <div className="wrap">
        <div className={styles.head} data-reveal>
          <h2 id="articulacion-title" className={styles.title}>
            Articulación con el Municipio y las empresas
          </h2>
          <p className={styles.intro}>
            CEPROC se apoya en dos vínculos: un espacio físico estable para los talleres y la cooperación con empresas para
            equipar la formación y acercar a los egresados al empleo formal.
          </p>
        </div>

        <div className={styles.cols}>
          <article className={styles.col} aria-labelledby="municipio-title" data-reveal>
            <h3 id="municipio-title" className={styles.colTitle}>
              {municipality.title}
            </h3>
            <p className={styles.who}>Municipio de Rawson</p>
            <p className={styles.text}>{municipality.intro}</p>
            <blockquote className={styles.quote}>
              <p>{municipality.reason}</p>
            </blockquote>
            <details className={`disclosure ${styles.more}`}>
              <summary className="btn btn-ghost">
                Qué se solicita y qué se compromete CEPROC
                <Plus size={16} aria-hidden="true" className="disclosure-icon" />
              </summary>
              <p className={styles.listTitle}>Se solicita específicamente</p>
              <ul className={styles.list}>
                {municipality.requests.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className={styles.listTitle}>Compromiso propuesto por CEPROC</p>
              <ul className={styles.list}>
                {municipality.commitments.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          </article>

          <article className={styles.col} aria-labelledby="empresas-title" data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            <h3 id="empresas-title" className={styles.colTitle}>
              {companies.title}
            </h3>
            <p className={styles.who}>Empresas mineras, industriales y de servicios</p>
            <p className={styles.text}>{companies.intro}</p>
            <blockquote className={styles.quote}>
              <p>{companies.commitment}</p>
            </blockquote>
            <p className={styles.listTitle}>Resultado buscado</p>
            <p className={styles.text}>{companies.result}</p>
            <details className={`disclosure ${styles.more}`}>
              <summary className="btn btn-ghost">
                Aportes que se propone solicitar
                <Plus size={16} aria-hidden="true" className="disclosure-icon" />
              </summary>
              <ul className={`${styles.list} ${styles.listTop}`}>
                {companies.contributions.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          </article>
        </div>

        <p className={styles.closing} data-reveal>
          {benefits.closing}
        </p>
      </div>
    </section>
  );
}
