import { LitText } from "../components/LitText";
import { Mosaic } from "../components/Mosaic";
import { about, areas, project, team } from "../content/ceproc";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="quienes-somos" className={`on-paper ${styles.section}`} aria-labelledby="quienes-title">
      <div className="wrap">
        <div className={styles.head}>
          <div className={styles.intro}>
            <p className={`eyebrow ${styles.kicker}`} data-reveal>
              Quiénes somos · CEPROC
            </p>
            <h2 id="quienes-title" className={styles.title} data-reveal>
              {about.title}.
            </h2>
            <div className={styles.text} data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <Mosaic />
        </div>

        <section className={styles.purpose} aria-labelledby="proposito-title">
          <div>
            <h3 id="proposito-title" className={`eyebrow ${styles.kicker}`}>
              Propósito central
            </h3>
            <LitText className={styles.purposeText} text={about.purpose} highlight={["capacidades", "prácticas", "laborales", "productivas"]} />
          </div>
          {/* Datos del documento, en baldosas de instrumento. */}
          <dl className={styles.metrics} data-reveal>
            <div>
              <dt className="eyebrow">Áreas de formación</dt>
              <dd>{String(areas.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt className="eyebrow">Talleres propuestos</dt>
              <dd>{areas.reduce((n, a) => n + a.workshops.length, 0)}</dd>
            </div>
            <div>
              <dt className="eyebrow">Etapas hacia el trabajo</dt>
              <dd>{String(project.pathway.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt className="eyebrow">Departamento</dt>
              <dd className={styles.place}>Rawson, San Juan</dd>
            </div>
          </dl>
        </section>

        <div className={styles.split}>
          <section className={styles.team} aria-labelledby="direccion-title" data-reveal>
            <h3 id="direccion-title" className={styles.subtitle}>
              Dirección del proyecto
            </h3>
            <ul className={styles.people}>
              {team.map((t, i) => (
                <li key={t.name} className={styles.card} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                  <figure className={styles.portrait}>
                    <img
                      src={t.photo}
                      alt={t.photoIsIllustrative ? `Retrato ilustrativo temporal (no corresponde a ${t.name}).` : `${t.name}, ${t.role}.`}
                      width={800}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                    />
                    {t.photoIsIllustrative && <figcaption>Retrato ilustrativo</figcaption>}
                  </figure>
                  <div className={styles.cardText}>
                    <p className={styles.person}>{t.name}</p>
                    <p className={styles.role}>{t.role}</p>
                    <p className={styles.detail}>{t.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <dl className={styles.mv} data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            <div>
              <dt>Misión</dt>
              <dd>{about.mission}</dd>
            </div>
            <div>
              <dt>Visión</dt>
              <dd>{about.vision}</dd>
            </div>
          </dl>
        </div>

        <section className={styles.values} aria-labelledby="valores-title">
          <h3 id="valores-title" className={styles.subtitle} data-reveal>
            Valores institucionales
          </h3>
          <ul>
            {about.values.map((v, i) => (
              <li key={v.name} data-reveal style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                <p className={styles.vname}>{v.name}</p>
                <p className={styles.vtext}>{v.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
