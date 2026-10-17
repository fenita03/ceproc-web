const fs = require("fs");
const path = require("path");
const sp = process.argv[2], out = process.argv[3];
const { parts } = JSON.parse(fs.readFileSync(path.join(sp, "parts-paths.json"), "utf8"));
const INK = { navy: "#0B2545", green: "#1F6B3E", gold: "#C49A45" };
const ORDER = ["gold", "green", "navy"];
function svg(regions, pad = 20, title = "CEPROC") {
  const ps = parts.filter((p) => regions.includes(p.region)).sort((a, b) => ORDER.indexOf(a.ink) - ORDER.indexOf(b.ink));
  const x0 = Math.min(...ps.map((p) => p.bbox[0])) - pad, y0 = Math.min(...ps.map((p) => p.bbox[1])) - pad;
  const x1 = Math.max(...ps.map((p) => p.bbox[2])) + pad, y1 = Math.max(...ps.map((p) => p.bbox[3])) + pad;
  const body = ps.map((p) => `<path data-part="${p.region}" data-ink="${p.ink}" fill="${INK[p.ink]}" fill-rule="evenodd" d="${p.d}"/>`).join("");
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`, box: [x0, y0, x1 - x0, y1 - y0] };
}
const full = svg(["mark", "word", "sub", "lema", "rule"], 24, "CEPROC — Centro Productivo de Capacitación en Oficios Regionales y Minería");
const lockup = svg(["mark", "word"], 16, "CEPROC");
const mark = svg(["mark"], 16, "CEPROC");
fs.writeFileSync(path.join(out, "public", "ceproc-logo.svg"), full.svg);
fs.writeFileSync(path.join(out, "src", "brand", "ceproc-logo.svg"), full.svg);
fs.writeFileSync(path.join(out, "src", "brand", "ceproc-lockup.svg"), lockup.svg);
fs.writeFileSync(path.join(out, "src", "brand", "ceproc-mark.svg"), mark.svg);
// Trazados del isotipo para la extrusión 3D (coordenadas de la reconstrucción vectorial).
const markParts = parts.filter((p) => p.region === "mark").map((p) => ({ ink: p.ink, color: INK[p.ink], d: p.d }));
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10));
const lockupParts = parts.filter((p) => p.region === "mark" || p.region === "word").map((p) => ({ ink: p.ink, color: INK[p.ink], d: round(p.d) }));
const ts = `/**
 * Isotipo de CEPROC reconstruido en vector a partir del logo de la carta institucional
 * (escaneo del PDF oficial, vectorizado con potrace por tinta). No editar a mano:
 * lo genera scripts/brand (ver README). Caja: ${JSON.stringify(mark.box)}.
 */
export const MARK_BOX = ${JSON.stringify(mark.box)} as const;
/** Isotipo + palabra CEPROC, tal como se combinan en el logo original. */
export const LOCKUP_BOX = ${JSON.stringify(lockup.box)} as const;
export const LOCKUP_PARTS = ${JSON.stringify(lockupParts)} as const;
export const INK = ${JSON.stringify(INK)} as const;
`;
fs.writeFileSync(path.join(out, "src", "brand", "mark-paths.ts"), ts);
console.log("full", full.box, "lockup", lockup.box, "mark", mark.box);
for (const f of ["public/ceproc-logo.svg", "src/brand/ceproc-lockup.svg", "src/brand/ceproc-mark.svg", "src/brand/mark-paths.ts"]) console.log(f, (fs.statSync(path.join(out, f)).size / 1024).toFixed(1), "KB");
