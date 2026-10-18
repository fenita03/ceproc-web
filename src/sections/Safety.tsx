import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { areas, safety } from "../content/ceproc";
import { photo } from "../content/photos";
import { showArea } from "../hooks/enroll";
import { ReadMore } from "../components/ReadMore";
import styles from "./Safety.module.css";

const pic = photo("seguridad");

export function Safety() {
  return (
    <section id="seguridad" className={`on-paper-2 ${styles.section}`} aria-labelledby="seguridad-title">
      {/* Fotografía a sangre: la prevención se muestra antes de explicarse. */}
      <figure className={styles.media} data-reveal="photo">
        <img
          src={pic.src}
          srcSet={pic.srcSet}
          sizes="(max-width: 960px) 100vw, 46vw"
          width={pic.width}
          height={pic.height}
          alt="Instructor ajustando un arnés de seguridad a un trabajador con casco."
          loading="lazy"
          decoding="async"
          style={{ objectPosition: `${pic.focus[0] * 100}% ${pic.focus[1] * 100}%` }}
        />
      </figure>

      <div className={styles.body}>
        <div className={styles.head}>
          <p className="index" data-reveal>
            <b>02</b> Seguridad
          </p>
          <h2 id="seguridad-title" className={styles.title} data-reveal style={{ "--d": "60ms" } as React.CSSProperties}>
            {safety.title}
          </h2>
          <p className={styles.lead} data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            En las áreas mineras se priorizan la seguridad, el mantenimiento responsable, la prevención de riesgos y el
            respeto por los procedimientos del sector.
          </p>
        </div>

        <div className={styles.lists}>
          <section aria-labelledby="transversales-title">
            <h3 id="transversales-title" className={styles.subtitle}>
              Competencias transversales
            </h3>
            <ul className={styles.bullets}>
              {safety.transversal.slice(0, 2).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ReadMore label={`Ver las ${safety.transversal.length} competencias`}>
              <ul className={styles.bullets}>
                {safety.transversal.slice(2).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className={styles.tracksText}>{safety.employability}</p>
            </ReadMore>
          </section>
          <section aria-labelledby="trayectos-title">
            <h3 id="trayectos-title" className={styles.subtitle}>
              Trayectos mineros propuestos
            </h3>
            <p className={styles.tracksText}>Los talleres mineros están en dos áreas de formación, con su objetivo y prácticas.</p>
            <ul className={styles.tracks} data-reveal="stagger">
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
                        <span className={styles.trackMeta}>
                          {a.section} · {a.workshops.length} talleres
                        </span>
                      </span>
                      <span className={styles.trackIcon}>
                        <ArrowRight size={18} aria-hidden="true" />
                      </span>
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
