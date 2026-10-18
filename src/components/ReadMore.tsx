import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import type { ReactNode } from "react";

/**
 * Texto extenso plegado: la sección muestra lo esencial y el resto del documento queda a un toque.
 * Es un <details> nativo (teclado, lector de pantalla y búsqueda del navegador funcionan sin JS).
 */
export function ReadMore({ label = "Leer más", children, className = "" }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <details className={`readmore ${className}`}>
      <summary>
        <span className="readmore-open">{label}</span>
        <span className="readmore-close">Leer menos</span>
        <Plus size={14} aria-hidden="true" className="readmore-icon" />
      </summary>
      <div className="readmore-body">{children}</div>
    </details>
  );
}

/** Separa la primera oración del resto (para mostrar solo la primera). No cambia el texto. */
export function firstSentence(text: string): [string, string] {
  const m = text.match(/^(.+?[.:])\s+(?=[A-ZÁÉÍÓÚÑ¿])/);
  return m ? [m[1], text.slice(m[0].length)] : [text, ""];
}
