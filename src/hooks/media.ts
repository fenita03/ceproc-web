import { useEffect, useState } from "react";

function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(() => (typeof window === "undefined" ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
export const useNarrow = () => useMedia("(max-width: 860px)");
/** Una sola columna (tablet y celular): las áreas se muestran como secuencia vertical. */
export const useStacked = () => useMedia("(max-width: 1000px)");

/**
 * Marca como visibles los elementos [data-reveal] al entrar en pantalla (una sola vez).
 * En los grupos `data-reveal="stagger"` numera los hijos (--i) para la cascada.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    document.querySelectorAll<HTMLElement>('[data-reveal="stagger"]').forEach((g) =>
      [...g.children].forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(Math.min(i, 10)))),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
