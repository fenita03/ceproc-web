import { useEffect, useLayoutEffect, useRef, useState } from "react";
import lockupReverse from "../brand/ceproc-lockup-reverse.svg";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { InstagramLogo } from "@phosphor-icons/react/dist/csr/InstagramLogo";
import { WhatsappLogo } from "@phosphor-icons/react/dist/csr/WhatsappLogo";
import { nav } from "../content/ceproc";
import { contact, generalInquiryUrl } from "../content/contact";
import { openEnroll } from "../hooks/enroll";
import styles from "./Header.module.css";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

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
    // Al bajar la cabecera se guarda (deja leer); al subir vuelve. Nunca sobre la portada.
    let lastY = scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = scrollY;
        const dy = y - lastY;
        if (Math.abs(dy) > 6) {
          setTucked(dy > 0 && y > innerHeight * 0.9);
          lastY = y;
        }
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      solidIo.disconnect();
      spy.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Indicador compartido: un solo hilo dorado que se desliza hasta la sección actual.
  useLayoutEffect(() => {
    const list = navRef.current;
    const mark = markRef.current;
    if (!list || !mark) return;
    const place = () => {
      const a = current ? list.querySelector<HTMLElement>(`a[href="#${current}"]`) : null;
      if (!a) {
        mark.style.opacity = "0";
        return;
      }
      mark.style.opacity = "1";
      mark.style.transform = `translateX(${a.offsetLeft + 12}px) scaleX(${a.offsetWidth - 24})`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [current]);

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
        const items = [toggleRef.current!, ...Array.from(panel.querySelectorAll<HTMLElement>("a, button"))];
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
    <header
      className={`${styles.header} ${solid || open ? styles.solid : ""}`}
      data-tucked={(tucked && !open) || undefined}
      onFocusCapture={() => setTucked(false)}
    >
      <div className={`wrap ${styles.bar}`}>
        <a href="#inicio" className={styles.brand} aria-label="CEPROC, ir al inicio">
          <img src={lockupReverse} alt="" width={140} height={60} />
        </a>
        <nav aria-label="Secciones" className={styles.nav}>
          <ul ref={navRef}>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={current === n.href.slice(1) ? "location" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <span ref={markRef} className={styles.mark} aria-hidden="true" />
        </nav>
        <button type="button" className={`btn btn-gold ${styles.cta}`} onClick={() => openEnroll()}>
          Capacitate con nosotros
          <ArrowRight size={16} aria-hidden="true" />
        </button>
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
        <div className={`wrap ${styles.panelIn}`}>
          <nav aria-label="Secciones">
            <ul>
              {nav.map((n, i) => (
                <li key={n.href} style={{ "--i": i } as React.CSSProperties}>
                  <a href={n.href} aria-current={current === n.href.slice(1) ? "location" : undefined} onClick={() => setOpen(false)}>
                    <span className={styles.panelNum} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.panelFoot} style={{ "--i": nav.length } as React.CSSProperties}>
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                setOpen(false);
                openEnroll();
              }}
            >
              Capacitate con nosotros
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <div className={styles.panelSocial}>
              <a href={generalInquiryUrl} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={20} aria-hidden="true" />
                WhatsApp
              </a>
              <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={20} aria-hidden="true" />@{contact.instagram.user}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
