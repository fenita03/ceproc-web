import { ReadMore, firstSentence } from "../components/ReadMore";
import { benefits, companies, municipality } from "../content/ceproc";
import styles from "./Articulation.module.css";

const [muniLead, muniRest] = firstSentence(municipality.intro);
const [compLead, compRest] = firstSentence(companies.intro);

export function Articulation() {
  return (
    <section id="articulacion" className={`on-paper-2 ${styles.section}`} aria-labelledby="articulacion-title">
      <div className="wrap">
        <div className={styles.head} data-reveal>
          <p className="index">
            <b>05</b> Articulación
          </p>
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
            <p className={styles.who}>
              <span className={styles.letter} aria-hidden="true">A</span> Municipio de Rawson
            </p>
            <h3 id="municipio-title" className={styles.colTitle}>
              {municipality.title}
            </h3>
            <p className={styles.text}>{muniLead}</p>
            <ReadMore>
              {muniRest && <p className={styles.text}>{muniRest}</p>}
              <blockquote className={styles.quote}>
                <p>{municipality.reason}</p>
              </blockquote>
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
            </ReadMore>
          </article>

          <article className={styles.col} aria-labelledby="empresas-title" data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            <p className={styles.who}>
              <span className={styles.letter} aria-hidden="true">B</span> Empresas mineras, industriales y de servicios
            </p>
            <h3 id="empresas-title" className={styles.colTitle}>
              {companies.title}
            </h3>
            <p className={styles.text}>{compLead}</p>
            <ReadMore>
              {compRest && <p className={styles.text}>{compRest}</p>}
              <blockquote className={styles.quote}>
                <p>{companies.commitment}</p>
              </blockquote>
              <p className={styles.listTitle}>Resultado buscado</p>
              <p className={styles.text}>{companies.result}</p>
              <p className={styles.listTitle}>Aportes que se propone solicitar</p>
              <ul className={styles.list}>
                {companies.contributions.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </ReadMore>
          </article>
        </div>

        <div className={styles.closing} data-reveal>
          <p className={styles.closingLabel}>Solicitud institucional</p>
          <div>
            <p className={styles.closingText}>CEPROC solicita al Intendente del Departamento Rawson la posibilidad de mantener una reunión institucional.</p>
            <ReadMore label="Leer la solicitud completa">
              <p className={styles.text}>{benefits.closing}</p>
            </ReadMore>
          </div>
        </div>
      </div>
    </section>
  );
}
