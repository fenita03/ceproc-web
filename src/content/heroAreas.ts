import { areas } from "./ceproc";
import { photo } from "./photos";

/**
 * Fuente única del núcleo de la portada: cada área real del documento con su fotografía.
 * Textos y cantidades salen de `ceproc.ts`; las fotos, de `photos.json` (con su crédito).
 */
export const heroAreas = areas.map((a, i) => {
  const p = photo(a.image);
  return {
    id: a.id,
    num: String(i + 1).padStart(2, "0"),
    label: a.label,
    section: a.section,
    title: a.title,
    short: a.summary,
    count: a.workshops.length,
    href: `#catalogo-${a.id}`,
    alt: a.imageAlt,
    photo: {
      /** Textura en celulares y ficha. */
      small: `/img/${a.image}-640.webp`,
      /** Fondo de la portada. */
      srcSet: p.srcSet,
      src: `/img/${a.image}-1600.webp`,
      focus: p.focus as [number, number],
      aspect: p.width / p.height,
      credit: p.credit,
    },
  };
});

export type HeroArea = (typeof heroAreas)[number];
