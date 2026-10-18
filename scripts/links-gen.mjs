import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const W = new URL("../node_modules/", import.meta.url).href.replace("file:///", "");
const React = (await import(pathToFileURL(W + "react/index.js").href)).default;
const { renderToStaticMarkup } = (await import(pathToFileURL(W + "react-dom/server.node.js").href)).default;
const ic = async (n) => renderToStaticMarkup(React.createElement((await import(pathToFileURL(`${W}@phosphor-icons/react/dist/ssr/${n}.es.js`).href))[n], { size: 22, weight: "regular", "aria-hidden": true }));
const PHONE = "2645563755";
const wa = `https://wa.me/549${PHONE}?text=${encodeURIComponent("Hola, CEPROC. Quiero consultar por las capacitaciones.")}`;
const links = [
  ["GraduationCap", "Capacitate con nosotros", "Contanos qué querés aprender", "/#capacitate", true],
  ["Globe", "Sitio web", "ceproc.vercel.app", "/"],
  ["Toolbox", "Áreas de formación", "7 áreas · 56 talleres propuestos", "/#areas"],
  ["WhatsappLogo", "WhatsApp", "264 556-3755", wa],
  ["EnvelopeSimple", "Correo", "araozsabrina4@gmail.com", "mailto:araozsabrina4@gmail.com"],
  ["Bank", "La institución", "Quiénes somos y el proyecto", "/#quienes-somos"],
];
const items = (await Promise.all(links.map(async ([i, t, s, h, main]) => `<li><a class="${main ? "main" : ""}" href="${h}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
<span class="ic">${await ic(i)}</span><span class="tx"><b>${t}</b><small>${s}</small></span><span class="ar">${await ic("ArrowUpRight")}</span></a></li>`))).join("\n");
const ig = await ic("InstagramLogo");
const html = `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>CEPROC · Enlaces</title>
<meta name="description" content="CEPROC — Centro Productivo de Capacitación en Oficios Regionales y Minería. Rawson, San Juan. Sitio web, capacitaciones y contacto.">
<meta name="theme-color" content="#ffffff">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:title" content="CEPROC · Enlaces">
<meta property="og:description" content="Capacitaciones, sitio web y contacto de CEPROC.">
<meta property="og:image" content="/og.png">
<style>
@font-face{font-family:Manrope;src:url(manrope-latin-wght-normal.woff2) format("woff2");font-weight:200 800;font-display:swap}
@font-face{font-family:"DM Sans";src:url(dm-sans-latin-wght-normal.woff2) format("woff2");font-weight:100 1000;font-display:swap}
:root{--navy:#0b2545;--ink2:#56647a;--gold:#c49a45;--line:rgba(11,37,69,.12);--ease:cubic-bezier(.23,1,.32,1)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100dvh;background:#fff;color:var(--navy);font:16px/1.5 "DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:480px;margin:0 auto;padding:max(40px,env(safe-area-inset-top)) 16px max(32px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;min-height:100dvh}
.logo{width:min(300px,78vw);height:auto;display:block}
h1{font:800 1.0625rem/1.35 Manrope,sans-serif;letter-spacing:-.01em;text-align:center;margin:22px 0 0;max-width:30ch;text-wrap:balance}
.place{margin:6px 0 0;color:var(--ink2);font-size:.9375rem}
ul{list-style:none;margin:32px 0 0;padding:0;width:100%;display:grid;gap:10px}
a{-webkit-tap-highlight-color:transparent}
li a{display:flex;align-items:center;gap:14px;min-height:64px;padding:12px 14px;border-radius:14px;text-decoration:none;color:inherit;background:#fff;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .18s var(--ease),transform .14s var(--ease)}
li a:active{transform:scale(.98)}
li a:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.ic{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:10px;background:#f5f3ee;color:var(--navy)}
.tx{flex:1;min-width:0;display:grid}
.tx b{font:700 1rem/1.25 Manrope,sans-serif;letter-spacing:-.01em}
.tx small{color:var(--ink2);font-size:.875rem;overflow-wrap:anywhere}
.ar{color:var(--ink2);flex:none;display:grid}
a.main{background:var(--navy);color:#fff;box-shadow:none}
a.main .ic{background:var(--gold);color:var(--navy)}
a.main .tx small,a.main .ar{color:#c9d3e2}
@media (hover:hover) and (pointer:fine){li a:not(.main):hover{box-shadow:inset 0 0 0 1px var(--gold)}a.main:hover{background:#10305a}}
.foot{margin-top:auto;padding-top:36px;display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--ink2);font-size:.8125rem}
.foot a{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;color:var(--navy);box-shadow:inset 0 0 0 1px var(--line)}
.foot a:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.motto{font-family:Manrope,sans-serif;font-weight:600;color:var(--gold)}
@media (prefers-reduced-motion:reduce){li a{transition:none}}
</style>
</head>
<body>
<main>
<img class="logo" src="/ceproc-logo.svg" alt="CEPROC — Centro Productivo de Capacitación en Oficios Regionales y Minería" width="300" height="153">
<h1>Formación práctica en oficios regionales y minería</h1>
<p class="place">Rawson, San Juan</p>
<ul>
${items}
</ul>
<footer class="foot">
<a href="https://www.instagram.com/ceproc_oficial/" target="_blank" rel="noopener" aria-label="Instagram de CEPROC">${ig}</a>
<span>@ceproc_oficial</span>
</footer>
</main>
</body>
</html>
`;
writeFileSync("D:/ceproc-web/public/links/index.html", html);
console.log("ok");
