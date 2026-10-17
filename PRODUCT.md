# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 + TypeScript, CSS Modules, tipografías locales (Manrope, DM Sans, IBM Plex Mono), Three.js (núcleo orbital de la portada: esfera con el logo extruido y las siete áreas en órbita; carga diferida, geometría del logo en un Web Worker, versión plana en SVG sin WebGL). Sitio estático más una función de Vercel (`api/cv.ts`) para los CV en Vercel Blob privado.

## Users

Personas de Rawson y San Juan interesadas en capacitarse (jóvenes y adultos), autoridades municipales (el proyecto solicita un espacio físico al Intendente de Rawson), empresas mineras, industriales y de servicios que podrían aportar equipamiento y prácticas, e instituciones educativas.

## Product Purpose

Sitio institucional de CEPROC — Centro Productivo de Capacitación en Oficios Regionales y Minería. Debe mostrar rápido qué es CEPROC y llevar a las capacitaciones (áreas y talleres); después, la institución y el proyecto; terminar en un contacto claro. «Capacitate con nosotros» recoge el interés de cada persona y lo envía por WhatsApp.

## Positioning

Una propuesta de formación práctica conectada con el trabajo, presentada con seriedad: cada dato sale del documento oficial; la certificación no se presenta como garantía de empleo.

## Capabilities and Constraints

- Proyecto en etapa de presentación: no hay sede, alumnos, convenios ni resultados. No inventar.
- 7 áreas y 56 talleres propuestos, con objetivos específicos literales del PDF.
- Contacto oficial (oct. 2026): teléfono y WhatsApp 264 556-3755, Instagram @ceproc_oficial y correo araozsabrina4@gmail.com, centralizados en `src/content/contact.ts`. Firma de la carta: no se publica.

## Brand Commitments

- Logo oficial: el de la carta (azul #0B2545, verde #1F6B3E, dorado #C49A45; casco, montañas, arco; lema "Formación que construye futuro"), reconstruido en vector desde el escaneo. El logo negro y dorado de la portada del PDF no se usa (decisión del responsable).
- Ubicación: Rawson, San Juan (decisión del responsable; la carta menciona Iglesia).
- Referencia de calidad de movimiento e interacción: NOVEX Soluciones Digitales (sistema orbital), adaptada a la identidad de CEPROC.

## Evidence on Hand

- `CEPROC_corregido_Jorge_Leopoldo_Espejo.pdf` (proyecto de 15 páginas + carta).
- Sin fotografías propias: las imágenes de áreas son de referencia, con licencias que no exigen atribución visible (Pexels, CC0, dominio público); fuentes en `docs/image-sources.md`.

## Product Principles

1. Fidelidad al documento antes que efecto.
2. Las capacitaciones primero, la institución en su sección (decisión del responsable, oct. 2026); el detalle extenso, plegado pero completo.
3. Interacción que explica (el núcleo une la institución con sus áreas).
4. Seriedad institucional: nada de promesas de empleo ni cifras inventadas.

## Accessibility & Inclusion

WCAG AA, navegación completa por teclado, selección táctil sin hover, `prefers-reduced-motion`.
