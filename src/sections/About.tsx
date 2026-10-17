import { LitText } from "../components/LitText";
import { Mosaic } from "../components/Mosaic";
import strataUrl from "../brand/estratos.svg";
import { about, areas, project, team } from "../content/ceproc";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="quienes-somos" className={`on-paper ${styles.section}`} aria-labelledby="quienes-title">
      <div className="wrap">
        <header className={styles.head}>
          <p className="index" data-reveal>
            <b>03</b> La institución
          </p>
          <h2 id="quienes-title" className={styles.title} data-reveal style={{ "--d": "60ms" } as React.CSSProperties}>
            {about.title}.
          </h2>
        </header>

        <div className={styles.story}>
          <div className={styles.text} data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            {about.paragraphs.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? styles.first : undefined}>
                {p}
              </p>
            ))}
          </div>
          <Mosaic />
        </div>

        <section className={styles.purpose} aria-labelledby="proposito-title">
          <span className={styles.purposeRule} data-reveal="rule" aria-hidden="true" />
          <div>
            <h3 id="proposito-title" className="eyebrow">
              Propósito central
            </h3>
            <LitText className={styles.purposeText} text={about.purpose} highlight={["capacidades", "prácticas", "laborales", "productivas"]} />
          </div>
          <dl className={styles.metrics} data-reveal="stagger">
            <div>
              <dt>Áreas de formación</dt>
              <dd>{String(areas.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Talleres propuestos</dt>
              <dd>{areas.reduce((n, a) => n + a.workshops.length, 0)}</dd>
            </div>
            <div>
              <dt>Etapas hacia el trabajo</dt>
              <dd>{String(project.pathway.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Departamento</dt>
              <dd className={styles.place}>Rawson, San Juan</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Misión y visión: banda en azul institucional, la voz más firme de la sección. */}
      <div className={styles.band}>
        <span className={`strata ${styles.bandStrata}`} aria-hidden="true">
          <img src={strataUrl} alt="" />
        </span>
        <dl className={`wrap ${styles.mv}`} data-reveal="stagger">
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

      <div className="wrap">
        <div className={styles.split}>
          <section className={styles.team} aria-labelledby="direccion-title">
            <h3 id="direccion-title" className={styles.subtitle} data-reveal>
              Dirección del proyecto
            </h3>
            <ul className={styles.people} data-reveal="stagger">
              {team.map((t) => (
                <li key={t.name} className={styles.card}>
                  <figure className={styles.portrait}>
                    <img
                      src={t.photo}
                      alt={t.photoIsPlaceholder ? `Silueta en contraluz; foto de ${t.name} a confirmar.` : `${t.name}, ${t.role}.`}
                      width={800}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                  <div className={styles.cardText}>
                    <p className={styles.role}>{t.role}</p>
                    <p className={styles.person}>{t.name}</p>
                    <p className={styles.detail}>{t.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.values} aria-labelledby="valores-title">
            <h3 id="valores-title" className={styles.subtitle} data-reveal>
              Valores institucionales
            </h3>
            <ul data-reveal="stagger">
              {about.values.map((v) => (
                <li key={v.name}>
                  <p className={styles.vname}>{v.name}</p>
                  <p className={styles.vtext}>{v.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
