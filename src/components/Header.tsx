import { useEffect, useRef, useState } from "react";
import lockupReverse from "../brand/ceproc-lockup-reverse.svg";
import { nav } from "../content/ceproc";
import styles from "./Header.module.css";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const solidIo = new IntersectionObserver(([e]) => setSolid(e.intersectionRatio < 0.96), { threshold: [0.96] });
    if (hero) solidIo.observe(hero);
    // Cada entrada del menú se enciende en cualquiera de sus secciones; en la portada, ninguna.
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const owner = nav.find((n) => (n.match as readonly string[]).includes(e.target.id));
          setCurrent(owner ? owner.href.slice(1) : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["inicio", ...nav.flatMap((n) => n.match)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => {
      solidIo.disconnect();
      spy.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = [toggleRef.current!, ...Array.from(panel.querySelectorAll<HTMLElement>("a"))];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${solid || open ? styles.solid : ""}`}>
      <div className={`wrap ${styles.bar}`}>
        <a href="#inicio" className={styles.brand} aria-label="CEPROC, ir al inicio">
          <img src={lockupReverse} alt="" width={140} height={60} />
        </a>
        <nav aria-label="Secciones" className={styles.nav}>
          <ul>
            {nav.slice(0, -1).map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={current === n.href.slice(1) ? "location" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contacto" className={`btn btn-ghost ${styles.cta}`} aria-current={current === "contacto" ? "location" : undefined}>
          Contacto
        </a>
        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          data-open={open}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <div id="menu-movil" ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Secciones" className="wrap">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} style={{ "--i": i } as React.CSSProperties}>
                <a href={n.href} aria-current={current === n.href.slice(1) ? "location" : undefined} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
