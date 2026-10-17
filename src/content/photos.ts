import data from "./photos.json";

export type PhotoKey = keyof typeof data;

/** Fotografías ilustrativas de Wikimedia Commons (no muestran instalaciones de CEPROC). */
export function photo(key: string) {
  const p = data[key as PhotoKey];
  return {
    ...p,
    src: `/img/${key}-1080.webp`,
    srcSet: p.widths.map((w) => `/img/${key}-${w}.webp ${Math.min(w, p.width)}w`).join(", "),
    credit: `${p.author} · ${p.license} · Wikimedia Commons`,
  };
}

export const allPhotos = Object.keys(data).map((k) => ({ key: k, ...photo(k) }));
