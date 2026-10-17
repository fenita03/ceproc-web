const potrace = require("potrace");
const fs = require("fs");
const path = require("path");
const sp = process.argv[2];
const man = JSON.parse(fs.readFileSync(path.join(sp, "parts.json"), "utf8"));
const opts = { turdSize: 80, optTolerance: 0.35, alphaMax: 1.0, threshold: 128, blackOnWhite: true };
(async () => {
  const out = [];
  for (const p of man.parts) {
    const d = await new Promise((res, rej) => {
      const t = new potrace.Potrace(opts);
      t.loadImage(path.join(sp, p.file), (err) => (err ? rej(err) : res(t.getPathTag("#000"))));
    });
    const m = d.match(/ d="([^"]+)"/);
    out.push({ region: p.region, ink: p.ink, bbox: p.bbox, d: m ? m[1] : "" });
  }
  fs.writeFileSync(path.join(sp, "parts-paths.json"), JSON.stringify({ w: man.w, h: man.h, parts: out }));
  const dbg = { mark: "#0B2545", word: "#c0392b", sub: "#8e44ad", lema: "#1F6B3E", rule: "#16a085" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${man.w} ${man.h}">` +
    out.map((p) => `<path fill="${p.region === "mark" ? ({ gold: "#C49A45", green: "#1F6B3E", navy: "#0B2545" })[p.ink] : dbg[p.region]}" fill-rule="evenodd" d="${p.d}"/>`).join("") + "</svg>";
  fs.writeFileSync(path.join(sp, "parts-debug.svg"), svg);
  console.log(out.map((p) => `${p.region}/${p.ink} ${(p.d.length / 1024).toFixed(1)}KB`).join(" | "));
})();
