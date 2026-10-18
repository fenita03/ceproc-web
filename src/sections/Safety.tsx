import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { areas, safety } from "../content/ceproc";
import { photo } from "../content/photos";
import { showArea } from "../hooks/enroll";
import { ReadMore } from "../components/ReadMore";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/media";
import styles from "./Safety.module.css";

const pic = photo("seguridad");

/**
 * Foto a sangre con «el eje»: al entrar la sección, la imagen se descubre de arriba hacia abajo detrás de una
 * línea dorada (el eje transversal del título) y después acompaña el scroll con un parallax leve.
 * El disparo observa la sección, no la foto: una foto recortada por completo no cuenta como visible.
 */
function useAxisReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          section.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(section);
    if (reduced) return () => io.disconnect();

    let frame = 0;
    let visible = false;
    const read = () => {
      frame = 0;
      const r = media.getBoundingClientRect();
      // -1 cuando la foto entra por abajo, 1 cuando sale por arriba.
      const p = Math.max(-1, Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / ((innerHeight + r.height) / 2)));
      media.style.setProperty("--shift", p.toFixed(4));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(read);
    };
    const vis = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      onScroll();
    });
    vis.observe(media);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    read();
    return () => {
      io.disconnect();
      vis.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return { sectionRef, mediaRef };
}

export function Safety() {
  const { sectionRef, mediaRef } = useAxisReveal();
  return (
    <section ref={sectionRef} id="seguridad" className={`on-paper-2 ${styles.section}`} aria-labelledby="seguridad-title">
      {/* Fotografía a sangre: la prevención se muestra antes de explicarse. */}
      <figure ref={mediaRef} className={styles.media}>
        <span className={styles.frame}>
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
          <span className={styles.curtain} aria-hidden="true" />
        </span>
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
