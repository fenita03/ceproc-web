import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { Suspense, lazy, useEffect, useState } from "react";
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
 * Acceso flotante: visible en todo el recorrido. Solo se aparta mientras la portada muestra sus
 * propios botones, para no duplicar la acción ni tapar el núcleo 3D.
 */
function Fab({ hidden }: { hidden: boolean }) {
  const [onHero, setOnHero] = useState(true);
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setOnHero(e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  const off = hidden || onHero;
  return (
    <button
      type="button"
      className={styles.fab}
      data-off={off || undefined}
      aria-hidden={off || undefined}
      tabIndex={off ? -1 : 0}
      onPointerEnter={() => void load()}
      onClick={() => openEnroll()}
    >
      <span className={styles.icon} aria-hidden="true">
        <GraduationCap size={18} />
      </span>
      <span className={styles.long}>Capacitate con nosotros</span>
      <span className={styles.short} aria-hidden="true">
        Capacitate
      </span>
    </button>
  );
}
