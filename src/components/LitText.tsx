import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/media";

/**
 * Frase que se enciende palabra por palabra con el scroll (de tenue a pleno).
 * Las palabras en `highlight` toman el color de acento al encenderse. El texto completo
 * está siempre en el DOM: el efecto es solo visual.
 */
export function LitText({ text, highlight = [], className = "" }: { text: string; highlight?: string[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const hl = new Set(highlight.map((w) => w.toLowerCase()));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLElement>("[data-w]")];
    if (reduced) {
      spans.forEach((s) => (s.dataset.on = "true"));
      return;
    }
    let raf = 0;
    let visible = false;
    let lit = -1;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // Empieza cuando la frase entra al 85 % de la pantalla; completa al llegar al 40 %.
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.45 + r.height * 0.4)));
      const n = Math.round(p * spans.length);
      if (n === lit) return;
      lit = n;
      spans.forEach((s, i) => (s.dataset.on = i < n ? "true" : "false"));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(read);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      onScroll();
    });
    io.observe(el);
    addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, text]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w data-hl={hl.has(w.replace(/[.,]/g, "").toLowerCase()) || undefined}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
