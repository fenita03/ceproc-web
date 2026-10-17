import { EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { MapPin } from "@phosphor-icons/react/dist/csr/MapPin";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { Phone } from "@phosphor-icons/react/dist/csr/Phone";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { useEffect, useRef } from "react";
import { contact, institution } from "../content/ceproc";
import { generalInquiryUrl } from "../content/enroll";
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
          <div data-reveal>
            <h2 id="contacto-title" className={styles.title}>
              Contacto
            </h2>
            <div className={styles.paths}>
              <div>
                <p className={styles.pathTitle}>Quiero capacitarme</p>
                <p className={styles.text}>Contanos qué área te interesa y te orientamos por WhatsApp. Podés sumar tu CV.</p>
                <button type="button" className="btn btn-gold" onClick={() => openEnroll()}>
                  <GraduationCap size={18} aria-hidden="true" />
                  Capacitate con nosotros
                </button>
              </div>
              <div>
                <p className={styles.pathTitle}>Otra consulta</p>
                <p className={styles.text}>
                  Para instituciones, empresas o consultas generales, escribinos por WhatsApp o por correo.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.card} data-reveal style={{ "--d": "80ms" } as React.CSSProperties}>
            <ul className={styles.channels}>
              <li>
                <a href={generalInquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.channel}>
                  <span className={styles.icon}>
                    <WhatsappLogo size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className={styles.label}>WhatsApp · consulta general</span>
                    <span className={styles.value}>{contact.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:+54${contact.phone}`} className={styles.channel}>
                  <span className={styles.icon}>
                    <Phone size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className={styles.label}>Teléfono</span>
                    <span className={styles.value}>{contact.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={styles.channel}>
                  <span className={styles.icon}>
                    <EnvelopeSimple size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className={styles.label}>Correo</span>
                    <span className={styles.value}>{contact.email}</span>
                  </span>
                </a>
              </li>
              <li className={styles.channel}>
                <span className={styles.icon}>
                  <MapPin size={20} aria-hidden="true" />
                </span>
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
