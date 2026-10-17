---
name: CEPROC
description: Sitio institucional del Centro Productivo de Capacitación en Oficios Regionales y Minería (Rawson, San Juan).
colors:
  navy: "#0b2545"
  green: "#1f6b3e"
  gold: "#c49a45"
  night: "#06111f"
  night-2: "#0a1a2f"
  night-3: "#10243f"
  on-night: "#e9eef6"
  on-night-2: "#a9b6c8"
  on-night-3: "#7d8ba0"
  line-night: "rgba(196, 214, 240, 0.1)"
  line-night-2: "rgba(196, 214, 240, 0.18)"
  paper: "#f5f3ee"
  paper-2: "#ebe7de"
  ink-2: "#35435a"
  ink-3: "#56647a"
  line-paper: "rgba(11, 37, 69, 0.12)"
  line-paper-2: "rgba(11, 37, 69, 0.22)"
  gold-on-night: "#d6ae5c"
  gold-on-paper: "#7f5f1c"
  green-on-night: "#6fbf8e"
typography:
  display:
    fontFamily: "Montserrat Variable, Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 0.9rem + 4.6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Montserrat Variable, Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 3vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Montserrat Variable, Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "\"tnum\""
rounded:
  sm: "8px"
  md: "14px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  max: "76rem"
  section-y: "clamp(5.5rem, 11vw, 9.5rem)"
  header-h: "4.5rem"
components:
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-gold-hover:
    backgroundColor: "#d3ab5b"
    textColor: "{colors.night}"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "rgba(255, 255, 255, 0.08)"
  card-night:
    backgroundColor: "{colors.night-2}"
    rounded: "{rounded.md}"
    padding: "clamp(18px, 2.4vw, 28px)"
  chip-area:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.on-night-2}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chip-area-selected:
    backgroundColor: "{colors.gold-on-night}"
    textColor: "{colors.night}"
  nav-link:
    textColor: "{colors.on-night-2}"
    rounded: "6px"
    padding: "8px 12px"
  nav-link-current:
    textColor: "#ffffff"
---

# Design System: CEPROC

## Overview

**Creative North Star: "El Núcleo"**

El logo real de CEPROC es el centro de gravedad del sistema: aparece extruido en 3D sobre la esfera del núcleo orbital de la portada, plano en el centro del núcleo de Áreas y como lockup en cabecera y pie. Todo lo demás se organiza a su alrededor con hilos de 1 px: órbitas, conexiones, rieles y separadores. La paleta no es elegida, es heredada: las tres tintas del logo (azul, verde, dorado) generan una noche azul para las superficies oscuras y un papel cálido para la lectura editorial.

El sitio alterna dos superficies. La noche (Portada, Proyecto, Áreas, Contacto) lleva la interacción y la profundidad; el papel (Quiénes somos, Articulación, Beneficios, Seguridad, pie) lleva la lectura larga, con listas separadas por hilos y sin tarjetas. El dorado es el color del estado activo y de la acción principal; el verde marca lo propio de la formación (roles, metadatos de área, viñetas de lista).

La densidad es institucional y sobria: titulares de Montserrat ajustados, lectura en Geist con medidas de 44–70ch, y movimiento que explica (el indicador que sigue al cursor, el riel que se llena con el scroll) en lugar de decorar.

**Key Characteristics:**
- Dos superficies: noche azul (#06111f) y papel cálido (#f5f3ee), alternadas por sección.
- Dorado como único color de estado activo; verde como color de formación.
- Hilos de 1 px para órbitas, conexiones, rieles y divisores; bordes como `inset` box-shadow.
- Radios de 8 y 14 px en superficies; píldora en botones y chips.
- Numeración de dos dígitos solo en elementos secuenciales (circuito, áreas, objetivos).
- Movimiento por `transform` y `opacity`, con alternativa para `prefers-reduced-motion`.

## Colors

Una paleta derivada íntegramente del logo: tres tintas institucionales, dos familias de superficie y variantes de acento ajustadas para contraste AA en cada fondo.

### Primary
- **Dorado del Arco** (gold): relleno del botón principal, anillo del núcleo, color de selección de texto y fondo del enlace de salto. Sobre texto solo se usa en sus variantes de contraste.
- **Dorado Noche** (gold-on-night): todo estado activo sobre noche: línea de conexión activa, nodo e indicador del núcleo, nodo encendido y relleno del riel del circuito, subrayado de navegación, anillo de foco, segunda línea del titular, números de secuencia. Contraste 8,9:1 sobre noche.
- **Dorado Papel** (gold-on-paper): anillo de foco sobre papel. Contraste 5,6:1.

### Secondary
- **Verde Formación** (green / green-on-paper): enunciados y roles sobre papel, viñetas de 10 × 1 px en listas de papel. Contraste 6,2:1.
- **Verde Noche** (green-on-night): metadatos de área, títulos de bloques complementarios y viñetas de listas sobre noche. Contraste 8,3:1.
- El verde y el dorado del logo también tiñen los halos radiales de fondo de las secciones nocturnas (opacidad 0,10–0,16).

### Neutral
- **Azul Institucional** (navy): tinta principal sobre papel (`--ink`), filete de 2 px que abre listas de papel.
- **Noche** (night): fondo base del sitio y de las secciones oscuras; cabecera sólida.
- **Noche 2 / Noche 3** (night-2, night-3): paneles y tarjetas sobre noche; fondo de medios y relleno de nodos inactivos.
- **Texto Noche 1–3** (on-night, on-night-2, on-night-3): cuerpo, texto secundario y metadatos/números inactivos. Los titulares sobre noche van en blanco puro.
- **Papel / Papel 2** (paper, paper-2): superficies editoriales claras; papel 2 distingue la sección de Articulación.
- **Tinta 2 / Tinta 3** (ink-2, ink-3): cuerpo y subtítulos sobre papel.
- **Hilos** (line-night, line-night-2, line-paper, line-paper-2): divisores, bordes internos y órbitas; la variante 2 marca límites de bloque, la 1 separa filas.

### Named Rules
**La Regla del Logo como Fuente.** Ningún tono nuevo entra al sistema si no deriva de las tres tintas del logo; las superficies son el azul llevado a noche o el blanco llevado a papel.

**La Regla del Dorado Activo.** El dorado significa "esto está activo o es la acción principal". No se usa como decoración neutra.

**La Regla del Acento con Contraste.** Sobre texto y hilos finos se usa siempre la variante `-on-night` o `-on-paper`, nunca la tinta cruda del logo.

## Typography

**Display Font:** Montserrat Variable (con Montserrat, ui-sans-serif, system-ui)
**Body Font:** Geist Variable (con Geist, ui-sans-serif, system-ui, Segoe UI)

**Character:** Montserrat es la familia del logotipo y lleva la voz institucional en titulares compactos y negativos de tracking; Geist da una lectura neutra y técnica a cuerpo, etiquetas y datos.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 0.9rem + 4.6vw, 5.25rem)`, 0,98): titular de portada en dos líneas, la segunda en dorado noche. El lema de Contacto usa la misma voz (`clamp(2.25rem, 1.2rem + 4.4vw, 5.25rem)`, 1,04, máx. 14ch).
- **Headline** (700, `--step-headline`, 1,04, −0,03em): títulos de sección.
- **Title** (600, `--step-title`, 1,2, −0,02em): enunciados de sección (máx. 20ch); subtítulos de bloque entre 1,5 y 2,25rem.
- **Lead** (400, `--step-lead`, 1,55): bajada de portada y aperturas (máx. 44–46ch).
- **Body** (400, 1rem / 1,0625rem en textos de sección, 1,6): lectura; medidas de 44–70ch. Listas y tablas en 0,9375rem.
- **Label** (600, 0,75–0,8125rem, cifras tabulares): números de secuencia, metadatos, rótulos de dato. Sin mayúsculas forzadas ni tracking abierto.

### Named Rules
**La Regla del Titular Compacto.** h1–h3 en Montserrat 700, interlineado 1,04, tracking −0,03em y `text-wrap: balance`; la portada aprieta a −0,04em.

**La Regla de la Secuencia Numerada.** El número de dos dígitos (`01`, `02`…) en cifras tabulares aparece solo donde hay orden real: pasos del circuito, las siete áreas (núcleo, chips y catálogo) y los objetivos específicos. Nunca como rótulo decorativo de sección.

## Layout

Contenedor centrado de `--max` (76rem) con márgenes `--gutter`; secciones con `--section-y` de padding vertical. Las cabeceras de sección usan rejillas asimétricas 7/5 o 6/5 (título a la izquierda, bajada alineada abajo a la derecha); los bloques internos 5/7. Portada: rejilla 7/5 con copia a la izquierda y medallión (máx. 640 px) a la derecha, altura `max(100svh, 680px)`.

Separaciones internas en `clamp()`: 56–120 px entre bloques mayores, 24–96 px de gap entre columnas. Cortes responsive observados: 1000 px (navegación a panel móvil; Áreas a una columna), 960 px (portada apila con el medallión arriba, máx. 420 px), 860 px (circuito pasa a vertical, Contacto a una columna), 760 px (rótulos del núcleo se reemplazan por una fila táctil de chips con scroll-snap), 620/520/480 px (listas y valores a una columna).

## Elevation & Depth

Sistema plano con capas tonales: la profundidad sobre noche viene de escalones de superficie (night → night-2 → night-3), halos radiales de verde y dorado detrás del contenido y una retícula de puntos tenue (28 px) en la portada. Los bordes se dibujan como `inset` box-shadow de 1 px. Las únicas sombras proyectadas son difusas y pertenecen a la acción principal y al medallión.

### Shadow Vocabulary
- **Brillo dorado** (`0 0 0 1px rgba(255,255,255,0.18) inset, 0 10px 26px -12px rgba(196,154,69,0.55)`): botón dorado.
- **Borde interno** (`inset 0 0 0 1px var(--line-night-2)`): tarjetas, paneles, botón ghost, chips, iconos de contacto.
- **Halo activo** (`0 0 0 6px rgba(214,174,92,0.14)`): nodo encendido del circuito.

### Named Rules
**La Regla del Hilo.** Los límites se trazan con hilos de 1 px (`vector-effect: non-scaling-stroke` en SVG), no con sombras.

## Shapes

Radios suaves y pocos: 14 px (`--radius`) en tarjetas y panel de área, 8 px (`--radius-sm`) en notas y rótulos, 6 px en enlaces de navegación, píldora (999 px) en botones, chips, etiquetas de taller y créditos. El círculo es la forma recurrente: medallión, núcleo, nodos, botón de scroll, iconos de contacto y botón de acordeón. Las viñetas de lista son trazos horizontales de 10 × 1 px; las listas de papel abren con un filete de 2 px en azul institucional.

## Components

### Buttons
- **Shape:** píldora (999 px), alto mínimo 48 px, padding horizontal 22 px, Geist 600 a 0,9375rem.
- **Primary (dorado):** fondo dorado del arco, texto noche, brillo dorado.
- **Ghost:** fondo blanco al 4 %, texto on-night, borde interno de 1 px.
- **Hover / Focus:** solo con puntero fino; dorado aclara a #d3ab5b; ghost sube a 8 % y su borde pasa a dorado al 60 %; la flecha se desplaza 3 px. Al presionar, `scale(0.97)`. Foco: contorno dorado de 2 px con offset 3 px.
- **Variante de cabecera:** ghost de 40 px de alto y 0,875rem; con la sección de Contacto activa gana borde dorado.

### Chips
- **Fila táctil de áreas (≤760 px):** píldoras de 44 px con número y nombre, fondo 4 % y borde interno; seleccionada en dorado noche con texto noche.
- **Etiquetas de taller:** píldoras de 0,8125rem en el panel de área, no interactivas.

### Cards / Containers
- **Corner Style:** 14 px.
- **Background:** night-2 sobre noche.
- **Shadow Strategy:** borde interno de 1 px (ver Elevation & Depth).
- **Internal Padding:** `clamp(18px, 2.4vw, 28px)` a `clamp(20px, 2.4vw, 30px)`.
- **Notas:** radio 8 px, fondo blanco al 3 % o dorado al 7 % con borde dorado al 25 %.
- Sobre papel no hay tarjetas: el contenido se organiza en listas y filas separadas por hilos.

### Navigation
- **Cabecera fija** de 4,5rem con lockup de 46 px. Sobre la portada, un degradado corto de noche garantiza contraste; al desplazarse pasa a noche sólida con hilo inferior.
- **Enlaces:** Geist 500 a 0,875rem en on-night-2; actual en blanco con subrayado dorado de 1 px que crece con `scaleX`.
- **Móvil (≤1000 px):** hamburguesa de dos líneas que rota a cruz; panel a pantalla completa con enlaces en Montserrat 600 a 1,5rem, entrada escalonada (`translateY` + opacidad, 35 ms por ítem); el actual en dorado.

### Núcleo de Áreas (componente firma)
SVG de 1000 × 860 con el lockup real de CEPROC sobre un disco papel y anillo dorado de 2 px al centro, dos órbitas elípticas de 1 px (la interior punteada) y siete nodos distribuidos desde arriba. Cada nodo se une al núcleo con un hilo; la conexión activa se traza en dorado noche (1,6 px). Un indicador dorado (anillo + punto) sigue al cursor real con un resorte amortiguado (k 0,16, amortiguación 0,62, sin rebote, interrumpible), se imanta al área más cercana dentro de un radio de 150 y vuelve al área seleccionada al salir; con movimiento reducido salta sin interpolar. Los rótulos son botones reales con número tabular y nombre; el activo se ilumina en blanco con fondo night-2 al 75 %. Clic, teclado y toque seleccionan; en táctil la selección es solo por toque. Junto al núcleo, un panel muestra imagen ilustrativa con crédito, metadatos en verde noche y el conteo de talleres en dorado.

### Núcleo orbital de la portada
Esfera azul noche de acabado lacado (clearcoat) con el logo real de CEPROC en relieve en su versión invertida (azul → blanco papel, como en la cabecera), iluminada con luz de borde dorada y relleno verde: los colores del logo. Alrededor, tres órbitas inclinadas de 1 px (la central punteada) que giran juntas y lentamente; las siete áreas son nodos en siete ángulos iguales (los rótulos no se superponen). Rótulos HTML anclados a cada nodo, hacia afuera del núcleo; en los bordes del escenario, encima del nodo. Al acercar el cursor (imán de 16 % del ancho con histéresis 0,72; sobre un rótulo manda el rótulo) el nodo se agranda con halo dorado, aparece un filamento dorado desde la esfera, las órbitas casi se detienen y la foto del área reemplaza el paisaje de fondo (fundido 360 ms); la ficha muestra número, sección, título, descripción y talleres reales. Clic/Enter fija, Escape suelta. En celular: números junto a los nodos, fila táctil de nombres y la foto del área dentro de la ficha. Sin WebGL: la misma disposición en SVG (proyección de las mismas órbitas) con el logo invertido.

### Circuito (Pathway)
Cinco pasos en rejilla horizontal sobre un riel de 1 px que se llena en dorado con `scaleX` según el progreso; cada nodo (15 px) se enciende con halo al alcanzarse. Bajo 860 px el riel pasa a vertical (`scaleY`).

### Catálogo de talleres
Acordeón nativo (`details`) con número dorado, título en Montserrat 600 y botón circular de 28 px cuyo signo más rota a menos. Dentro, tablas que en móvil se reorganizan en filas apiladas.

## Do's and Don'ts

### Do:
- **Do** derivar cualquier color nuevo de navy, green o gold, y usar `gold-on-night` / `gold-on-paper` / `green-on-night` sobre texto e hilos finos.
- **Do** alternar noche para interacción y papel para lectura, usando las clases de superficie `on-paper` y `on-paper-2`.
- **Do** dibujar órbitas, conexiones, rieles y divisores con hilos de 1 px y bordes como `inset` box-shadow.
- **Do** mover solo con `transform` y `opacity` y curvas `--ease-out` (cubic-bezier(0.23, 1, 0.32, 1)); dar a cada animación una alternativa bajo `prefers-reduced-motion: reduce` (fundido lineal o sin movimiento).
- **Do** limitar los efectos de hover a `(hover: hover) and (pointer: fine)` y garantizar selección táctil equivalente.
- **Do** mantener el contenido visible sin JS: las apariciones al entrar en pantalla solo ocultan cuando existe la clase `js`.
- **Do** usar el logo real (lockup o isotipo) como núcleo; nunca un sustituto.

### Don't:
- **Don't** poner rótulos tipo kicker o eyebrow sobre los títulos de sección.
- **Don't** numerar lo que no es una secuencia: los números de dos dígitos quedan para el circuito, las áreas y los objetivos específicos.
- **Don't** inventar cifras, contadores o métricas: los datos visibles salen del documento oficial (7 áreas, 56 talleres, Rawson).
- **Don't** usar el logo negro y dorado de la portada del PDF.
- **Don't** convertir el papel en una grilla de tarjetas; sobre papel se lee en listas y filas con hilos.
- **Don't** usar sombras duras desplazadas ni bordes gruesos fuera del filete de 2 px de las listas de papel.
