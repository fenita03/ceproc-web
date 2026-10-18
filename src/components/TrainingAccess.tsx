import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { Suspense, lazy, useEffect, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { contact, generalInquiryUrl } from "../content/contact";
import { ENROLL_EVENT, openEnroll, type EnrollPreset } from "../hooks/enroll";
import styles from "./TrainingAccess.module.css";

// El asistente se descarga aparte (cuando el navegador está libre o al primer toque).
const load = () => import("./TrainingWizard");
const TrainingWizard = lazy(load);

/**
 * Punto de entrada único de «Capacitate con nosotros»: atiende las aperturas pedidas desde cualquier
 * botón (openEnroll), monta el asistente una sola vez (conserva las respuestas) y muestra el acceso
 * flotante persistente.
 */
export function TrainingAccess() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<EnrollPreset & { n: number }>({ n: 0 });

  useEffect(() => {
    const onOpen = (ev: Event) => {
      setPreset({ ...((ev as CustomEvent<EnrollPreset>).detail ?? {}), n: Date.now() });
      setMounted(true);
      setOpen(true);
    };
    window.addEventListener(ENROLL_EVENT, onOpen);
    // Enlace directo al formulario (página de enlaces de Instagram): ceproc.vercel.app/#capacitate
    if (location.hash === "#capacitate") {
      history.replaceState(null, "", location.pathname + location.search);
      openEnroll();
    }
    const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(() => load(), { timeout: 4000 }) : setTimeout(load, 2500));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener(ENROLL_EVENT, onOpen);
  }, []);

  return (
    <>
      <Fab hidden={open} />
      {mounted && (
        <Suspense fallback={null}>
          <TrainingWizard open={open} preset={preset} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

/**
 * Acceso flotante en dos partes: «Capacitate» abre el asistente y el ícono abre WhatsApp directo.
 * Se aparta sobre la portada (tiene sus propios botones) y mientras Contacto está en pantalla
 * (ya muestra los mismos accesos), para no duplicar acciones ni tapar contenido.
 */
function Fab({ hidden }: { hidden: boolean }) {
  const [onHero, setOnHero] = useState(true);
  const [onContact, setOnContact] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("inicio");
    const contacto = document.getElementById("contacto");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) setOnHero(e.intersectionRatio > 0.6);
          if (e.target === contacto) setOnContact(e.isIntersecting);
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    if (hero) io.observe(hero);
    if (contacto) io.observe(contacto);
    return () => io.disconnect();
  }, []);
  const off = hidden || onHero || onContact;
  return (
    <div className={styles.fab} data-off={off || undefined} aria-hidden={off || undefined} role="group" aria-label="Accesos rápidos">
      <button type="button" className={styles.main} tabIndex={off ? -1 : 0} onPointerEnter={() => void load()} onClick={() => openEnroll()}>
        <GraduationCap size={18} aria-hidden="true" className={styles.mainIcon} />
        <span className={styles.long}>Capacitate con nosotros</span>
        <span className={styles.short} aria-hidden="true">
          Capacitate
        </span>
      </button>
      <a
        href={generalInquiryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.wa}
        tabIndex={off ? -1 : 0}
        aria-label={`Escribir a CEPROC por WhatsApp (${contact.phoneDisplay})`}
      >
        <WhatsappLogo size={20} aria-hidden="true" />
      </a>
    </div>
  );
}
