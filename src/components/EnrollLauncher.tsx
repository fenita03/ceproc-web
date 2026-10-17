import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ENROLL_EVENT, openEnroll, type EnrollPreset } from "../hooks/enroll";
import styles from "./EnrollLauncher.module.css";

// El formulario se descarga aparte (cuando el navegador está libre o al primer toque): la portada no carga más.
const load = () => import("./Enroll");
const Enroll = lazy(load);

/**
 * «Capacitate con nosotros»: acceso flotante y punto de entrada del formulario. Escucha las aperturas
 * pedidas desde cualquier sección (openEnroll) y monta el diálogo una sola vez, para conservar las respuestas.
 */
export function EnrollLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<EnrollPreset & { n: number }>({ n: 0 });
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (ev: Event) => {
      returnTo.current = document.activeElement as HTMLElement | null;
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
      <Launcher hidden={open} />
      {mounted && (
        <Suspense fallback={null}>
          <Enroll open={open} preset={preset} returnTo={returnTo} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

function Launcher({ hidden }: { hidden: boolean }) {
  // Se oculta donde ya hay un acceso propio (portada, capacitaciones y contacto) y sobre el pie.
  const [covered, setCovered] = useState(true);
  useEffect(() => {
    const seen = new Map<Element, boolean>();
    const update = () => setCovered([...seen.values()].some(Boolean));
    const hero = document.getElementById("inicio");
    const ends = [document.getElementById("areas"), document.getElementById("contacto"), document.querySelector("footer")].filter(
      Boolean,
    ) as Element[];
    const heroIo = new IntersectionObserver(([e]) => (seen.set(e.target, e.intersectionRatio > 0.35), update()), { threshold: [0, 0.35, 1] });
    const endIo = new IntersectionObserver(
      (es) => {
        es.forEach((e) => seen.set(e.target, e.isIntersecting));
        update();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    if (hero) heroIo.observe(hero);
    ends.forEach((el) => endIo.observe(el));
    return () => {
      heroIo.disconnect();
      endIo.disconnect();
    };
  }, []);
  const off = hidden || covered;
  return (
    <button
      type="button"
      className={`btn btn-gold ${styles.launcher}`}
      data-off={off || undefined}
      aria-hidden={off || undefined}
      tabIndex={off ? -1 : 0}
      onPointerEnter={() => void load()}
      onClick={() => openEnroll()}
    >
      <GraduationCap size={20} aria-hidden="true" />
      Capacitate con nosotros
    </button>
  );
}
