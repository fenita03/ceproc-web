import { ArrowUp } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { InstagramLogo } from "@phosphor-icons/react/dist/csr/InstagramLogo";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import logoUrl from "../brand/ceproc-logo.svg";
import strataUrl from "../brand/estratos.svg";
import { institution, nav } from "../content/ceproc";
import { contact, generalInquiryUrl } from "../content/contact";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`on-paper ${styles.footer}`}>
      <span className={`strata ${styles.strata}`} aria-hidden="true">
        <img src={strataUrl} alt="" />
      </span>
      <div className={`wrap ${styles.top}`}>
        <div className={styles.brand}>
          {/* Versión plana original del logo institucional. */}
          <img src={logoUrl} alt={`CEPROC — ${institution.name}. ${institution.motto}.`} className={styles.logo} width={420} height={214} />
          <p className={styles.name}>{institution.name}</p>
          <p className={styles.motto}>{institution.tagline}</p>
        </div>

        <nav aria-label="Pie de página" className={styles.col}>
          <p className={styles.colTitle}>Secciones</p>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <p className={styles.colTitle}>Contacto</p>
          <ul>
            <li>
              <a href={`tel:${contact.tel}`}>{contact.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className={styles.mail}>
                {contact.email}
              </a>
            </li>
            <li className={styles.muted}>{contact.place}</li>
          </ul>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Redes oficiales</p>
          <ul className={styles.social}>
            <li>
              <a href={generalInquiryUrl} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={18} aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={18} aria-hidden="true" />@{contact.instagram.user}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <p className={styles.note}>
          CEPROC es un proyecto institucional en etapa de presentación. La información de este sitio proviene del documento
          oficial del proyecto.
        </p>
        <p>
          © {new Date().getFullYear()} CEPROC · {institution.location}
        </p>
        <a href="#inicio" className={styles.up}>
          Volver arriba
          <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
