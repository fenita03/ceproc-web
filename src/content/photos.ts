import data from "./photos.json";

export type PhotoKey = keyof typeof data;

/** Fotografías de referencia de cada área (Pexels, CC0 o dominio público; fuentes en docs/image-sources.md). */
export function photo(key: string) {
  const p = data[key as PhotoKey];
  return {
    ...p,
    src: `/img/${key}-1080.webp`,
    srcSet: p.widths.map((w) => `/img/${key}-${w}.webp ${Math.min(w, p.width)}w`).join(", "),
  };
}

export const allPhotos = Object.keys(data).map((k) => ({ key: k, ...photo(k) }));
