# CEPROC — sitio institucional

Sitio de presentación del **Centro Productivo de Capacitación en Oficios Regionales y Minería** (Rawson, San Juan).
Todo el contenido proviene del documento del proyecto y vive en un único archivo: `src/content/ceproc.ts`.

## Uso

```bash
npm install
npm run dev        # desarrollo
npm run build      # compilación de producción en dist/
npm run preview    # sirve dist/
npm test           # pruebas Playwright (escritorio 1440×900 y Pixel 7)
```

`npm test` levanta `vite preview` en el puerto 4180 (o usa `BASE_URL` si está definida).

## Estructura

| Ruta | Contenido |
|---|---|
| `src/content/ceproc.ts` | Textos, áreas, 56 talleres, contacto. Única fuente de verdad. |
| `src/content/photos.*` | Fotos ilustrativas (Wikimedia Commons) y sus créditos. |
| `src/brand/` | Logo reconstruido en vector (SVG) y trazados para el 3D. |
| `src/components/HeroCore.tsx` | Núcleo orbital de la portada: las siete áreas en órbita alrededor del logo (cursor, clic, teclado, toque); la foto del área cambia el fondo. |
| `src/components/three/` | Escena 3D del núcleo (`orbitCore.ts`), disposición compartida con la versión plana (`orbitLayout.ts`) y logo extruido en un Web Worker. |
| `src/content/heroAreas.ts` | Fuente única de las siete áreas del núcleo (textos y cantidades de `ceproc.ts`, fotos de `photos.json`). |
| `src/components/AreaHub.tsx` | Núcleo interactivo de áreas (cursor, teclado, toque). |
| `src/sections/` | Secciones en orden: Portada, Capacitaciones (áreas), Seguridad, Quiénes somos, El proyecto, Articulación, Beneficios, Contacto. |
| `src/components/TrainingAccess.tsx` | Acceso flotante «Capacitate con nosotros» y carga diferida del asistente. |
| `src/components/TrainingWizard.tsx` | Asistente paso a paso adaptado de «Contanos tu proyecto» de NOVEX (`novex-web/src/pages/ProjectWizard.tsx`). |
| `src/content/wizard.ts` | Preguntas, validación, saneamiento, resumen y mensaje de WhatsApp (adaptado de `novex-web/src/data/wizard.ts`). |
| `api/cv.ts` | Función de Vercel: valida el CV, lo guarda privado en Vercel Blob y entrega un enlace firmado que vence. |
| `scripts/brand/` | Proceso de vectorización del logo desde el escaneo. |
| `scripts/fotos.py` | Descarga y conversión de las fotos a WebP. |
| `scripts/perf.mjs` | Medición de fps y tareas largas con GPU. |
| `tests/ceproc.spec.ts` | Pruebas de extremo a extremo del sitio. |
| `tests/wizard.spec.ts` | Pruebas del asistente, del acceso flotante, del CV, del mensaje de WhatsApp y de `api/cv`. |

## «Capacitate con nosotros» (asistente y WhatsApp)

Misma experiencia que «Hablemos de tu proyecto» de NOVEX: una pregunta por paso (área, talleres, objetivo,
experiencia y horarios, datos, CV, revisión), pasos opcionales con «Omitir», revisión con «Editar» y envío por WhatsApp.
Se abre desde el acceso flotante, el encabezado, la portada, «Me interesa este taller» y Contacto.


- Destino: el teléfono oficial `contact.phone` (+54 9 264 523-9410), confirmado como WhatsApp. Se puede cambiar con
  `VITE_WHATSAPP_NUMBER` (ver `.env.example`).
- WhatsApp no permite adjuntar archivos desde un enlace `wa.me`, así que el CV va por uno de dos caminos:
  - **Con almacenamiento configurado:** el navegador sube el archivo a `/api/cv`, que comprueba que sea un PDF o DOCX real
    (≤ 4 MB, el límite de cuerpo de las funciones de Vercel es 4,5 MB), lo guarda **privado** en Vercel Blob y devuelve
    un enlace firmado que vence a los 30 días. El mensaje solo incluye el enlace cuando la subida terminó bien.
  - **Sin almacenamiento:** el formulario lo avisa y el mensaje dice que el CV se adjunta en el chat. En celulares hay un
    botón «Compartir el CV».
- El sitio nunca dice que algo se envió: abre WhatsApp con el mensaje y aclara que falta tocar «Enviar».

### Subida de CV en Vercel (activa)

Blob Store privado `ceproc-cv` (región gru1, São Paulo) conectado al proyecto, y `CV_LINK_SECRET` cargado en producción
(16/10/2026). Para rehacerlo en otro proyecto:

1. En el proyecto de Vercel: **Storage → Create Database → Blob** y conectarlo al proyecto (crea `BLOB_READ_WRITE_TOKEN`).
2. **Settings → Environment Variables:** agregar `CV_LINK_SECRET` con 32 caracteres aleatorios o más (`openssl rand -hex 32`).
3. Volver a desplegar. `GET /api/cv?status` debe responder `{"ready":true}`.
4. Para probar en local con la función: `npx vercel dev` (con `vercel env pull`); `npm run dev` usa el flujo sin almacenamiento.

Los CV no se borran solos: el enlace vence, pero el archivo queda en el Blob Store hasta que se elimine desde el panel de
Vercel. La política de conservación está en `docs/politica-de-privacidad-PROPUESTA.md` (borrador para CEPROC).

## Fotografías

`python -I scripts/fotos.py [clave ...]` descarga de Wikimedia Commons las ocho fotos (siete áreas y el paisaje de San Juan),
genera WebP de 640/1080/1600 px (el paisaje, con gradación de color, hasta 3200 px) y escribe autor, licencia y fuente en
`src/content/photos.json`. Los créditos se publican al pie del sitio. Son imágenes ilustrativas.

## Retratos de «Dirección del proyecto»

`public/img/equipo/directora.webp` y `vicedirector.webp` son retratos ilustrativos temporales en contraluz
(generados con `node scripts/equipo/retratos.mjs`; no representan a las personas). Para publicar las fotos reales:
reemplazar esos archivos con el mismo nombre (proporción 4:5) y poner `photoIsIllustrative: false` en `team`
(`src/content/ceproc.ts`).

## Logo del núcleo

`src/brand/ceproc-peak.svg` (y su versión invertida) contiene solo la montaña con el arco y la palabra CEPROC,
tomadas de los trazados originales del logo (sin casco, guion ni líneas verdes). `PEAK_PARTS` en `mark-paths.ts`
alimenta el relieve 3D de la esfera.

## Para confirmar con la institución

- Logo y nombre oficiales (el documento muestra dos versiones).
- Departamento: el sitio indica Rawson.
- Política de privacidad: revisar el borrador de `docs/` y definir cuánto tiempo se conservan los CV.
- Fotos reales de talleres para reemplazar las ilustrativas.
