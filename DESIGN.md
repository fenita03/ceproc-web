---
name: CEPROC
description: Sitio institucional del Centro Productivo de Capacitación en Oficios Regionales y Minería (Rawson, San Juan).
colors:
  navy: "#0b2545"
  green: "#1f6b3e"
  gold: "#c49a45"
  night: "#06111f"
  night-0: "#040c17"
  night-2: "#0a1a2f"
  night-3: "#10243f"
  on-night: "#e9eef6"
  on-night-2: "#a9b6c8"
  on-night-3: "#8592a6"
  line-night: "rgba(196, 214, 240, 0.1)"
  line-night-2: "rgba(196, 214, 240, 0.18)"
  forest: "#0c2618"
  forest-2: "#12321f"
  on-forest-2: "#b3c7b9"
  line-forest: "rgba(190, 230, 205, 0.14)"
  paper: "#f5f3ee"
  paper-2: "#ebe7de"
  paper-3: "#e1dccf"
  ink-2: "#35435a"
  ink-3: "#56647a"
  line-paper: "rgba(11, 37, 69, 0.12)"
  line-paper-2: "rgba(11, 37, 69, 0.22)"
  gold-on-night: "#d6ae5c"
  gold-on-paper: "#7f5f1c"
  green-on-night: "#6fbf8e"
typography:
  display:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.1rem + 5.6vw, 6.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.3rem + 3.5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.042em"
  title:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.6vw, 2.625rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  subtitle:
    fontFamily: "Manrope Variable, Manrope Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.08rem + 0.6vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.022em"
  lead:
    fontFamily: "DM Sans Variable, DM Sans Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "DM Sans Variable, DM Sans Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.06em"
    fontFeature: "\"tnum\""
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 4.5rem)"
  max: "90rem"
  section-y: "clamp(5rem, 10vw, 9rem)"
  header-h: "4.5rem"
motion:
  ease-out: "cubic-bezier(0.23, 1, 0.32, 1)"
  ease-out-expo: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
  micro: "160ms"
  state: "240ms"
  enter: "640ms"
  reveal: "900ms"
components:
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-gold-hover:
    backgroundColor: "#ddb868"
    textColor: "{colors.night}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "rgba(233, 238, 246, 0.08)"
  card-night:
    backgroundColor: "{colors.night-2}"
    rounded: "18px"
    padding: "8px"
  fab:
    backgroundColor: "rgba(6, 17, 31, 0.94)"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "44px"
  nav-link:
    textColor: "{colors.on-night-2}"
    rounded: "6px"
    padding: "10px 12px"
  nav-link-current:
    textColor: "#ffffff"
---

# Design System: CEPROC

## Overview

**Creative North Star: «Estratos»**

San Juan se lee en sus capas de roca: el Cerro Alcázar de Calingasta, las sierras de la precordillera, la mina.
CEPROC forma por capas: oficio, seguridad, certificación, trabajo. El sistema traduce esa idea en tres recursos
propios: la **fotografía del territorio** a gran formato (el afloramiento de Calingasta abre la portada), las
**líneas de estratos** (`src/brand/estratos.svg`, trazos de 1 px en `currentColor`) como textura discreta al pie de la
portada, en la banda de misión y visión, en Beneficios y en el pie, y los **hilos técnicos** de 1 px que ordenan
índices, rieles y divisores como en un plano.

El logo real sigue siendo el centro: plano en la cabecera y el pie, y como núcleo de la órbita 3D de las siete áreas
en la portada. La paleta sale de sus tres tintas (azul, verde, dorado) y genera cuatro superficies que se alternan
para que ninguna sección se parezca a la anterior.

Lo que el sistema rechaza: plantillas de IA con gradientes morados, grillas de tarjetas idénticas, vidrio
translúcido sin función, neón, sombras duras y cualquier cifra que no salga del documento oficial.

**Key Characteristics:**
- Superficie principal **blanca**, como el Instagram oficial: logo a color (montaña + CEPROC) en la cabecera,
  titulares en azul institucional con la segunda línea en dorado (#a67c2e), botones dorados.
- Superficies alternas claras: blanco, papel (#f5f3ee) y brote (#eef4f0, Beneficios). La única superficie oscura es la
  lámina fotográfica del núcleo 3D en la portada (y la pastilla del acceso flotante), con la clase `.theme-dark`.
- Manrope 800 en titulares con tracking cerrado; DM Sans para leer; IBM Plex Mono para rótulos técnicos y datos.
- Índice de sección (`01 · Capacitaciones` … `07 · Contacto`): número de orden real del recorrido, sobre un hilo dorado.
- Dorado solo para estado activo y acción principal; verde para lo propio de la formación.
- Movimiento por `transform` y `opacity` (más `clip-path` en tres cortinas de fotos), siempre con alternativa
  reducida.

## Colors

### Primary
- **Dorado del Arco** (gold): relleno del botón principal, color de selección de texto, hover de los íconos de contacto.
- **Dorado Noche** (gold-on-night): todo estado activo sobre superficies oscuras: indicador deslizante de la
  navegación y de las pestañas de áreas, riel del índice de El proyecto, números de área, filamento del núcleo, anillo
  de foco. 8,9:1 sobre noche.
- **Dorado Papel** (gold-on-paper): números y viñetas sobre papel, anillo de foco sobre papel. 5,6:1.

### Secondary
- **Verde Formación** (green / green-on-paper): roles, metadatos de vínculo y viñetas sobre papel. 6,2:1.
- **Verde Noche** (green-on-night): cifras y filete de Beneficios, luz de borde del núcleo 3D. 8,3:1.
- **Monte** (forest, forest-2, on-forest-2): superficie exclusiva de Beneficios.

### Neutral
- **Azul Institucional** (navy): tinta sobre papel y fondo de la banda de misión y visión.
- **Noche / Noche 0 / 2 / 3**: fondo base, cabecera, paneles del núcleo, láminas del carrusel.
- **Texto Noche 1–3**, **Tinta 2–3**: cuerpo, secundarios y metadatos.
- **Papel / Papel 2 / Papel 3**: superficies claras; papel 3 es el fondo de carga de las fotos.
- **Hilos** (line-night, line-paper, line-forest y sus variantes 2): divisores y bordes internos.

### Named Rules
**La Regla del Logo como Fuente.** Ningún tono entra al sistema si no deriva de las tres tintas del logo.

**La Regla del Dorado Activo.** El dorado significa «esto está activo o es la acción principal»; no decora.

**La Regla del Acento con Contraste.** Sobre texto e hilos finos se usan las variantes `-on-night` / `-on-paper`.

**La Regla de la Alternancia.** Dos secciones seguidas nunca comparten superficie y composición: portada (blanco +
lámina oscura del núcleo) → Capacitaciones (papel, índice y tarjetas 3D blancas) → Seguridad (foto a sangre + blanco)
→ La institución (blanco + banda papel de misión y visión) → El proyecto (papel, índice lateral) → Articulación
(blanco, dos columnas) → Beneficios (brote) → Contacto (blanco) → pie (papel).

**La Regla de los Tokens Semánticos.** Los componentes usan `--surface`, `--surface-2/3`, `--heading`, `--text`,
`--text-2/3`, `--line`, `--line-2`, `--accent` y `--accent-green`. Son claros por defecto; `.theme-dark` los vuelve a la
paleta de noche. El texto sobre dorado usa siempre `--on-gold`.

**La Regla del Texto Justo.** Cada sección muestra título y una oración; el resto del documento queda completo en
«Leer más» (`src/components/ReadMore.tsx`, un `<details>` nativo). Nunca se borra contenido institucional.

## Typography

**Display:** Manrope Variable (200–800). **Texto:** DM Sans Variable con eje óptico. **Técnica:** IBM Plex Mono 400/500.

**Por qué:** Manrope tiene aperturas amplias y una «a» de dos pisos que sostiene titulares de 800 sin perder
legibilidad (las tildes del español no chocan con el interlineado de 0,98); DM Sans tiene eje de tamaño óptico, lo
que afina el cuerpo de 15–17 px y abre la bajada; IBM Plex Mono aporta la voz industrial de los rótulos (familia nacida
en una empresa de ingeniería). Las tres separan a CEPROC de NOVEX, que usa Geist.

**Carga:** archivos locales (Fontsource), subconjunto latino precargado (`vite.config.ts` agrega `<link rel=preload>` a
las dos fuentes del primer render) y respaldos con métricas medidas (`size-adjust`, `ascent-override`,
`descent-override` en `global.css`, calculadas con `scripts/fallback-metrics.mjs`) para que el texto no salte.

### Hierarchy
- **Display** (800, `--fs-display`, 0,98, −0,045em): titular de portada en dos líneas, la segunda en dorado noche.
  Limitado a `12,4cqi` del bloque de texto para que nunca se corte.
- **Headline** (800, `--fs-h1`, 0,98, −0,042em): títulos de sección y lema de Contacto.
- **Title** (700–800, `--fs-h2`): títulos de bloque (catálogo, circuito, columnas de Articulación, Contacto).
- **Subtitle** (700, `--fs-h3`): áreas, personas, beneficios, valores.
- **Lead** (400, `--fs-lead`, 1,55): bajadas y primer párrafo de cada relato; 44–50ch.
- **Body** (400, 1,0625rem, 1,65): lectura; listas a 0,9375rem.
- **Label** (IBM Plex Mono 500, 0,75rem, +0,06em, mayúsculas): índices, rótulos de dato, metadatos. Solo frases de una
  a cuatro palabras; nunca párrafos en mayúsculas.
- **Cifras** (Manrope 700–800, `tabular-nums lining-nums`): 07 áreas, 56 talleres, 05 etapas, cantidades de beneficios.

### Named Rules
**La Regla de la Secuencia Numerada.** Los números de dos dígitos aparecen solo donde hay orden real: el recorrido de
secciones (índice), las siete áreas, los talleres de un área, las cinco etapas, los pasos de lectura de El proyecto y
los objetivos específicos. Las competencias, valores y beneficios llevan viñetas, no números.

**La Regla de los Datos Reales.** Toda cifra sale del documento oficial (las cantidades de Beneficios son el número de
ítems que lista el documento).

## Layout

Contenedor de `--max` (90rem) con márgenes `--gutter`. Cabeceras de sección: índice + titular amplio (14–17ch) y bajada
alineada abajo cuando hay espacio. Composiciones propias por sección: portada 6/6 con el núcleo a la derecha;
Capacitaciones con índice de siete columnas, ficha 5 + vitrina 7; Seguridad a dos mitades con la foto a sangre
(46/54); La institución con relato 5/7 y recorrido fotográfico escalonado; El proyecto con índice fijo 3 + contenido 9;
Articulación en dos columnas separadas por hilo vertical y carta de cierre; Contacto 5/7 con accesos grandes.

Cortes responsive: 1100 px (núcleo bajo el texto), 1000 px (menú móvil, índice de áreas con desplazamiento lateral,
El proyecto sin índice), 960 px (relatos y Seguridad a una columna), 860 px (portada compacta), 640/620/520 px (listas
a una columna, flotante con rótulo corto).

## Elevation & Depth

Profundidad por fotografía, superficies y velos, no por sombras. Velo de la portada en dos gradientes (lectura a la
izquierda, roca viva a la derecha, fundido a noche abajo); luz cálida dorada y luz verde de borde en el núcleo 3D;
estratos al 8–12 % de opacidad. Sombras: solo difusas en las láminas del carrusel y el acceso flotante.

## Motion

Sistema con cuatro duraciones (`--dur-micro` 160 ms, `--dur-state` 240 ms, `--dur-enter` 640 ms, `--dur-reveal`
900 ms) y tres curvas (`--ease-out` para entradas y estados, `--ease-out-expo` para desplazamientos largos e
indicadores, `--ease-in-out` solo para el avance automático del carrusel). Nunca `ease-in` para entrar ni
`transition: all`.

- **Entrada de la portada (≈1,2 s, sin bloquear la interacción):** la cabecera baja 12 px; el rótulo; cada línea del
  titular sube desde su propia máscara (900 ms, 110 ms entre líneas); bajada y botones; el núcleo se enciende con
  escala 0,96 → 1; el hilo de las cifras se dibuja (`scaleX`) y las cifras entran en cascada; la foto de fondo se asienta
  (1,08 → 1, 1,8 s).
- **Apariciones al desplazarse** (`data-reveal`): `up` (18 px + opacidad), `fade`, `rule` (hilos que se dibujan),
  `photo` (cortina con `clip-path` y la foto que se asienta) y `stagger` (hijos en cascada de 55 ms).
- **Fotografías:** fundido de 520 ms entre la foto de fondo y la de cada área; cortina en el recorrido de La
  institución y en Seguridad; parallax leve (`translate3d`) en portada y recorrido.
- **Navegación:** un único hilo dorado se desliza (`translateX` + `scaleX`) hasta la sección actual; lo mismo en las
  pestañas de áreas; la cabecera se guarda al bajar y vuelve al subir o al recibir foco.
- **Microinteracciones:** botones con relleno que sube desde abajo (pseudoelemento con `transform`) y flecha que avanza
  3 px; presionar escala 0,97; rótulos del núcleo que se separan 3 px de su nodo; íconos de contacto que se rellenan
  en dorado y flecha diagonal que avanza.
- **Por qué `clip-path`:** las tres cortinas de fotos corren una sola vez por elemento y Chrome/Safari las componen sin
  recalcular el diseño; medido sin caídas (`scripts/perf.mjs`).
- **Movimiento reducido:** todo pasa a fundidos de 160–240 ms lineales o a estado final inmediato; el carrusel no avanza
  solo; la cabecera no se oculta; el núcleo salta sin interpolar.

## Components

### Buttons
Píldora de 48 px, DM Sans 600 a 0,97rem, ícono a la izquierda o flecha a la derecha. Dorado (acción principal) y
fantasma con hilo interno. Hover solo con puntero fino. Foco: contorno dorado de 2 px con separación de 3 px.

### Acceso flotante
Pastilla de noche de 44 px partida en dos: «Capacitate con nosotros» (abre el asistente; «Capacitate» en celular) y
un ícono de WhatsApp que abre el chat oficial. Respeta `safe-area-inset`. Se aparta sobre la portada y mientras
Contacto está en pantalla (ya muestra los mismos accesos) y mientras el asistente está abierto.

### Núcleo orbital de la portada (componente firma)
Logo plano de CEPROC en el centro, tres órbitas inclinadas y las siete áreas como nodos con rótulos HTML (botones
reales). Cursor con imán e histéresis, clic/Enter fija, Escape suelta, flechas recorren, toque con la fila de chips en
celular. La foto del área reemplaza el fondo (escritorio) o aparece en la ficha (celular). Iluminación: luz cálida
dorada y luz verde de borde. Rendimiento: carga diferida, pausa fuera de pantalla, resolución adaptativa y versión SVG
sin WebGL.

### Índice de áreas
Siete columnas separadas por hilos con número mono y nombre; el hilo dorado superior se desliza a la activa. En
pantallas angostas, desplazamiento lateral con imán.

### Contacto
WhatsApp e Instagram como filas grandes (ícono circular de 56 px, dato en Manrope 700, flecha diagonal); teléfono,
correo y ubicación en tres columnas compactas. Todos los datos salen de `src/content/contact.ts`.

### Pie
Lockup, nombre completo y lema técnico; columnas Secciones, Contacto y Redes oficiales; nota de etapa de presentación,
© y «Volver arriba». Sin créditos fotográficos (ver `docs/image-sources.md`).

## Do's and Don'ts

### Do:
- **Do** derivar todo color de navy, green o gold y usar las variantes de contraste sobre texto e hilos.
- **Do** respetar la alternancia de superficies y dar a cada sección su propia composición.
- **Do** usar el índice de sección y los rótulos IBM Plex Mono para orientar, con frases cortas.
- **Do** animar solo `transform` y `opacity` (y `clip-path` en cortinas puntuales), con alternativa reducida.
- **Do** tomar teléfono, WhatsApp e Instagram de `src/content/contact.ts`.
- **Do** usar solo fotos con licencias sin atribución obligatoria y registrarlas en `docs/image-sources.md`.

### Don't:
- **Don't** mostrar leyendas de «imagen ilustrativa» ni créditos fotográficos en la interfaz.
- **Don't** inventar cifras, convenios, sedes o promesas de empleo.
- **Don't** numerar lo que no es una secuencia.
- **Don't** convertir el papel en grillas de tarjetas idénticas; sobre papel se lee en filas con hilos.
- **Don't** usar el logo negro y dorado de la portada del PDF.
- **Don't** usar sombras duras, neón, vidrio decorativo o gradientes de colores ajenos al logo.
