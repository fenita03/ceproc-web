import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { InstagramLogo } from "@phosphor-icons/react/dist/csr/InstagramLogo";
import { MapPin } from "@phosphor-icons/react/dist/csr/MapPin";
import { Phone } from "@phosphor-icons/react/dist/csr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { useEffect, useRef } from "react";
import { institution } from "../content/ceproc";
import { contact, generalInquiryUrl } from "../content/contact";
import { openEnroll } from "../hooks/enroll";
import { useReducedMotion } from "../hooks/media";
import styles from "./Contact.module.css";

const WORDS = institution.tagline.split(" · ");

export function Contact() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);

  // Lema institucional: cada palabra se enciende al cruzar la línea de lectura.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-w]"));
    if (reduced) {
      words.forEach((w) => (w.dataset.on = "true"));
      return;
    }
    let frame = 0;
    let visible = false;
    const read = () => {
      frame = 0;
      const line = innerHeight * 0.66;
      for (const w of words) {
        const on = String(w.getBoundingClientRect().top < line);
        if (w.dataset.on !== on) w.dataset.on = on;
      }
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(read);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      onScroll();
    });
    io.observe(root);
    addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section id="contacto" className={styles.section} aria-labelledby="contacto-title">
      <div className="wrap">
        <p className="index" data-reveal>
          <b>07</b> Contacto
        </p>
        <p ref={ref} className={styles.tagline}>
          {WORDS.map((w, i) => (
            <span key={w}>
              <span data-w>{w}</span>
              {i < WORDS.length - 1 && (
                <>
                  {" "}
                  <span className={styles.sep} aria-hidden="true">
                    ·
                  </span>{" "}
                </>
              )}
            </span>
          ))}
        </p>

        <div className={styles.grid}>
          <div className={styles.intro} data-reveal>
            <h2 id="contacto-title" className={styles.title}>
              Hablemos de tu capacitación
            </h2>
            <p className={styles.text}>
              Contanos qué área te interesa y te orientamos por WhatsApp. Instituciones, empresas y consultas generales
              también son bienvenidas.
            </p>
            <button type="button" className="btn btn-gold" onClick={() => openEnroll()}>
              <GraduationCap size={18} aria-hidden="true" />
              Capacitate con nosotros
            </button>
          </div>

          <div className={styles.channels}>
            <ul className={styles.primary} data-reveal="stagger">
              <li>
                <a href={generalInquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.big}>
                  <span className={styles.bigIcon}>
                    <WhatsappLogo size={26} aria-hidden="true" />
                  </span>
                  <span className={styles.bigText}>
                    <span className={styles.label}>WhatsApp · consulta general</span>
                    <span className={styles.bigValue}>{contact.phoneDisplay}</span>
                  </span>
                  <ArrowUpRight size={22} aria-hidden="true" className={styles.arrow} />
                </a>
              </li>
              <li>
                <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" className={styles.big}>
                  <span className={styles.bigIcon}>
                    <InstagramLogo size={26} aria-hidden="true" />
                  </span>
                  <span className={styles.bigText}>
                    <span className={styles.label}>Instagram oficial</span>
                    <span className={styles.bigValue}>@{contact.instagram.user}</span>
                  </span>
                  <ArrowUpRight size={22} aria-hidden="true" className={styles.arrow} />
                </a>
              </li>
            </ul>

            <ul className={styles.secondary} data-reveal="stagger" style={{ "--d": "120ms" } as React.CSSProperties}>
              <li>
                <a href={`tel:${contact.tel}`} className={styles.small}>
                  <Phone size={18} aria-hidden="true" />
                  <span>
                    <span className={styles.label}>Teléfono</span>
                    <span className={styles.value}>{contact.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={styles.small}>
                  <EnvelopeSimple size={18} aria-hidden="true" />
                  <span>
                    <span className={styles.label}>Correo</span>
                    <span className={styles.value}>{contact.email}</span>
                  </span>
                </a>
              </li>
              <li className={styles.small}>
                <MapPin size={18} aria-hidden="true" />
                <span>
                  <span className={styles.label}>Ubicación</span>
                  <span className={styles.value}>{contact.place}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
