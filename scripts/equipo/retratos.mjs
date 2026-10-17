// Retratos ilustrativos temporales (contraluz editorial) para «Dirección del proyecto».
// No representan a personas reales. Para usar la foto real, reemplazar el archivo con el mismo
// nombre: public/img/equipo/directora.webp y vicedirector.webp (proporción 4:5).
// Uso: node scripts/equipo/retratos.mjs
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const W = 800, H = 1000;

// Siluetas (un solo contorno por persona): cabeza, cuello, hombros y cabello.
const WOMAN =
  "M402 196 C 470 194, 528 236, 538 306 C 546 360, 540 404, 546 452 C 552 500, 574 538, 600 566 C 578 572, 556 570, 536 562 " +
  "C 532 580, 548 600, 590 616 C 668 646, 712 712, 732 800 C 748 870, 752 940, 754 1000 L 46 1000 C 48 940, 52 870, 68 800 " +
  "C 88 712, 132 646, 210 616 C 252 600, 268 580, 264 562 C 244 570, 222 572, 200 566 C 226 538, 248 500, 254 452 " +
  "C 260 404, 254 360, 262 306 C 272 236, 334 198, 402 196 Z";
const MAN =
  "M400 214 C 462 212, 504 252, 512 318 C 518 366, 514 402, 504 438 C 494 476, 476 506, 458 522 C 456 548, 462 576, 480 594 " +
  "C 556 614, 650 650, 690 740 C 712 800, 724 900, 726 1000 L 74 1000 C 76 900, 88 800, 110 740 C 150 650, 244 614, 320 594 " +
  "C 338 576, 344 548, 342 522 C 324 506, 306 476, 296 438 C 286 402, 282 366, 288 318 C 296 252, 338 216, 400 214 Z";

const portrait = (id, path, lightFromRight) => {
  const lx = lightFromRight ? 0.74 : 0.26;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="${lx}" cy="0.3" r="0.9">
      <stop offset="0" stop-color="#e9b873"/><stop offset="0.18" stop-color="#8a6a4c"/><stop offset="0.45" stop-color="#1d3355"/><stop offset="1" stop-color="#050c18"/>
    </radialGradient>
    <linearGradient id="body" x1="${lightFromRight ? 1 : 0}" y1="0" x2="${lightFromRight ? 0 : 1}" y2="0.3">
      <stop offset="0" stop-color="#1c2438"/><stop offset="0.35" stop-color="#0c1220"/><stop offset="1" stop-color="#05080f"/>
    </linearGradient>
    <linearGradient id="rimMask" x1="${lightFromRight ? 1 : 0}" y1="0" x2="${lightFromRight ? 0 : 1}" y2="0">
      <stop offset="0" stop-color="#fff"/><stop offset="0.42" stop-color="#fff" stop-opacity="0.15"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.25" stop-color="#fff"/><stop offset="0.9" stop-color="#fff" stop-opacity="0.15"/></linearGradient>
    <mask id="rim"><rect width="${W}" height="${H}" fill="url(#rimMask)"/></mask>
    <mask id="rimV"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
    <clipPath id="sil"><path d="${path}"/></clipPath>
    <filter id="blur18"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="blur3"><feGaussianBlur stdDeviation="2.4"/></filter>
    <filter id="blur10"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${lightFromRight ? 11 : 4}"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- fondo desenfocado: sierras y luces -->
  <g filter="url(#blur18)" opacity="0.85">
    <path d="M0 640 L 120 560 L 200 600 L 320 500 L 430 580 L 540 520 L 660 590 L 800 540 L 800 1000 L 0 1000 Z" fill="#14223a"/>
    <path d="M0 720 L 160 650 L 300 700 L 460 640 L 620 700 L 800 660 L 800 1000 L 0 1000 Z" fill="#0b1527"/>
    <circle cx="${lightFromRight ? 120 : 680}" cy="300" r="26" fill="#f2c27a" opacity="0.35"/>
    <circle cx="${lightFromRight ? 190 : 610}" cy="380" r="16" fill="#f2c27a" opacity="0.28"/>
    <circle cx="${lightFromRight ? 80 : 720}" cy="430" r="12" fill="#9fb6d8" opacity="0.3"/>
  </g>
  <path d="${path}" fill="#f3c27c" opacity="0.5" filter="url(#blur18)" transform="translate(${lightFromRight ? 10 : -10} -6)"/>
  <!-- silueta -->
  <path d="${path}" fill="url(#body)"/>
  <!-- borde de luz dorado -->
  <g mask="url(#rim)"><g mask="url(#rimV)">
    <path d="${path}" fill="none" stroke="#ffd18a" stroke-width="9" filter="url(#blur3)"/>
    <path d="${path}" fill="none" stroke="#ffe7bd" stroke-width="2"/>
    <path d="${path}" fill="none" stroke="#f0b765" stroke-width="40" opacity="0.45" filter="url(#blur10)"/>
  </g></g>
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
for (const [name, svg] of [["directora", portrait("m", WOMAN, true)], ["vicedirector", portrait("h", MAN, false)]]) {
  writeFileSync(`scripts/equipo/${name}.svg`, svg);
  await p.setContent(`<body style="margin:0">${svg}</body>`);
  await p.screenshot({ path: `scripts/equipo/${name}.png`, clip: { x: 0, y: 0, width: W, height: H } });
  execFileSync("python", ["-I", "-c", `from PIL import Image;Image.open(r'scripts/equipo/${name}.png').convert('RGB').save(r'public/img/equipo/${name}.webp','WEBP',quality=86,method=6)`]);
}
await b.close();
console.log("ok");
