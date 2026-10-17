import logoUrl from "../brand/ceproc-logo.svg";
import { institution, nav } from "../content/ceproc";
import { allPhotos } from "../content/photos";
import talleresFotos from "../content/talleres-fotos.json";

const pexelsCount = Object.values(talleresFotos).flat().length;
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`on-paper ${styles.footer}`}>
      <div className={`wrap ${styles.top}`}>
        {/* Versión plana original del logo institucional. */}
        <img src={logoUrl} alt={`CEPROC — ${institution.name}. ${institution.motto}.`} className={styles.logo} width={420} height={214} />
        <nav aria-label="Pie de página">
          <ul className={styles.nav}>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`wrap ${styles.bottom}`}>
        <p>
          CEPROC es un proyecto institucional en etapa de presentación: la información de este sitio proviene del documento
          oficial del proyecto. Las fotografías de las áreas son ilustrativas y no muestran instalaciones ni actividades de
          CEPROC.
        </p>
        <details className={styles.credits}>
          <summary>Créditos de las imágenes</summary>
          <ul>
            {allPhotos.map((p) => (
              <li key={p.key}>
                <a href={p.source} target="_blank" rel="noopener noreferrer">
                  {p.title.replace(/\.(jpe?g|png)$/i, "")}
                </a>{" "}
                — {p.author}, {p.license}
              </li>
            ))}
            <li>
              Fotos de los talleres (sección Áreas de formación):{" "}
              <a href="https://www.pexels.com/es-es/licencia/" target="_blank" rel="noopener noreferrer">
                Pexels, licencia Pexels
              </a>{" "}
              — {pexelsCount} fotografías ilustrativas; enlace a cada una en src/content/talleres-fotos.json.
            </li>
            <li>Logo: reconstrucción vectorial del logo institucional de CEPROC.</li>
            <li>Íconos: Phosphor (MIT).</li>
          </ul>
        </details>
        <p>
          © {new Date().getFullYear()} CEPROC · {institution.location}
        </p>
      </div>
    </footer>
  );
}
