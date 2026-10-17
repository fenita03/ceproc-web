# Fuentes y licencias de las imágenes

Documento interno (no se publica: `docs/` está excluido del despliegue en `.vercelignore`).
El sitio no muestra créditos fotográficos. Por eso solo se usan imágenes cuya licencia **no exige
atribución visible**: licencia Pexels, CC0 (dominio público dedicado) y dominio público.

Revisión de licencias (17/10/2026): cinco fotos de Wikimedia Commons con licencias CC BY / CC BY-SA
(que sí exigen atribución) se reemplazaron antes de quitar los créditos del pie:

| Clave | Antes (retirada) | Licencia anterior | Reemplazo |
|---|---|---|---|
| maquinaria | Haul truck under repair at Brockman 4 (Calistemon) | CC BY-SA 4.0 | Pexels 29506742 |
| regional | Baker woman's hands kneading bread dough (Shixart1985) | CC BY 2.0 | Pexels 6196391 |
| textil | Ishigaki Island minsa (norio nakayama) | CC BY-SA 2.0 | Pexels 6634692 |
| carpinteria | Ménuisiers au travail 2 (Minette Lontsie) | CC BY-SA 4.0 | Pexels 7484154 |
| paisaje | Embalse Ullum desde cerro Tres María (Enrique Guardia) | CC BY-SA 4.0 | Cerro Alcázar, Calingasta (CC0) |

Se regeneran con `python -I scripts/fotos.py [clave ...]`, que rechaza cualquier foto de Commons cuya
licencia no sea CC0 o dominio público.

## Fotos de áreas y portada (`public/img/<clave>-<ancho>.webp`, datos en `src/content/photos.json`)

| Clave | Descripción | Autor | Licencia | Fuente |
|---|---|---|---|---|
| maquinaria | Excavadora cargando un camión volquete en una cantera | Pexels | Licencia Pexels | https://www.pexels.com/photo/29506742/ |
| seguridad | Construction worker harness (9253634989) | National Institute for Occupational Safety and Health (NIOSH) from USA | Public domain | https://commons.wikimedia.org/wiki/File:Construction_worker_harness_(9253634989).jpg |
| regional | Mujer horneando pan en un horno de piedra tradicional | Pexels | Licencia Pexels | https://www.pexels.com/photo/6196391/ |
| cocina | Chefs at Work (Unsplash) | Michael Browning michaelwb | CC0 | https://commons.wikimedia.org/wiki/File:Chefs_at_Work_(Unsplash).jpg |
| textil | Manos tejiendo hilos de colores en un telar de madera | Pexels | Licencia Pexels | https://www.pexels.com/photo/6634692/ |
| creativa | Making pottery (Unsplash) | Jared Sluyter jaredsluyter | CC0 | https://commons.wikimedia.org/wiki/File:Making_pottery_(Unsplash).jpg |
| carpinteria | Dos carpinteros trabajando juntos en un taller | Pexels | Licencia Pexels | https://www.pexels.com/photo/7484154/ |
| paisaje | Cerro Alcázar | Funeslandia | CC0 | https://commons.wikimedia.org/wiki/File:Cerro_Alc%C3%A1zar.jpg |

## Fotos de talleres (`public/img/talleres/`, datos en `src/content/talleres-fotos.json`)

Todas de Pexels, [licencia Pexels](https://www.pexels.com/es-es/licencia/): uso gratuito, sin atribución
obligatoria.

| Archivo | Descripción (Pexels) | Fuente |
|---|---|---|
| mineros-1-1 | Excavadora Hyundai amarilla operando en una cantera rocosa bajo un cielo azul claro. Perfecto para temas industriales. | https://www.pexels.com/es-es/foto/industria-excavadora-marca-mina-15071423/ |
| mineros-1-2 | Primer plano de las manos de un mecánico reparando el motor, mostrando trabajo en equipo y habilidad. | https://www.pexels.com/es-es/foto/mecanico-realizando-mantenimiento-de-motor-29226627/ |
| mineros-1-3 | Ingeniero con equipo de seguridad trabajando en un panel eléctrico exterior, asegurando la funcionalidad del sistema. | https://www.pexels.com/es-es/foto/trabajando-reparando-mantenimiento-electricista-17842832/ |
| mineros-1-4 | Un soldador enfocado en el trabajo con metales en una fábrica industrial, mostrando habilidad y precisión. | https://www.pexels.com/es-es/foto/hombre-trabajando-industria-metal-15016529/ |
| mineros-1-5 | Imagen detallada de un mecánico reparando el motor de un coche, mostrando experiencia técnica. | https://www.pexels.com/es-es/foto/mano-mecanico-reparando-reparacion-de-coches-4116221/ |
| mineros-2-1 | Close-up de un trabajador de la construcción que lleva equipo de seguridad mientras se concentra en una tarea en interiores. | https://www.pexels.com/es-es/foto/hombre-edificio-construccion-industria-17842695/ |
| mineros-2-2 | Un profesional médico ajusta gafas de protección mientras usa ropa estéril para un entorno seguro. | https://www.pexels.com/es-es/foto/hombre-profesional-doctor-proteccion-7108175/ |
| mineros-2-3 | Trabajador industrial con equipo de seguridad de pie bajo la luz del sol en un sitio de construcción. | https://www.pexels.com/es-es/foto/hombre-en-pie-de-pie-seguridad-17993024/ |
| mineros-2-4 | Trabajador industrial concentrado con equipo de protección revisando documentos en una fábrica en Rusia. | https://www.pexels.com/es-es/foto/trabajador-industrial-revisando-documentos-en-fabrica-32845698/ |
| mineros-2-5 | Trabajador industrial con equipo de protección manejando productos químicos en un entorno de almacén. | https://www.pexels.com/es-es/foto/persona-vestida-con-traje-blanco-con-contenedor-blanco-209230/ |
| mineros-2-6 | Mesero interactuando con clientes en un encantador restaurante mexicano en Guanajuato. | https://www.pexels.com/es-es/foto/mesero-sirviendo-en-restaurante-mexicano-guanajuato-31752132/ |
| regional-1 | Primer plano de varios quesos artesanales madurando en estanterías de madera en Usseaux, Italia. | https://www.pexels.com/es-es/foto/eroica-festival-formaggio-d-alpeggio-19196908/ |
| regional-2 | Rollos de queso fresco madurando en una rejilla en una fábrica de quesos, mostrando la preparación de alimentos. | https://www.pexels.com/es-es/foto/comida-preparacion-fabricando-queso-5953719/ |
| regional-3 | Chefs en una cocina profesional preparando y emplatando platos gourmet con precisión y trabajo en equipo. | https://www.pexels.com/es-es/foto/restaurante-mujer-hombres-cocina-6937464/ |
| regional-4 | Un chef tatuado prepara con maestría un plato gourmet con precisión y habilidad en la cocina de un restaurante. | https://www.pexels.com/es-es/foto/chef-preparando-un-plato-gourmet-en-una-cocina-profesional-36430089/ |
| regional-5 | Equipo de chefs preparando masa para un evento culinario en un entorno de cocina comercial. | https://www.pexels.com/es-es/foto/comida-trabajando-hombres-masa-11330115/ |
| regional-6 | Mujer horneando pan fresco en un horno de piedra tradicional en Turquía. | https://www.pexels.com/es-es/foto/pan-mujer-sujetando-horneando-6196391/ |
| regional-7 | Primer plano de pan recién horneado siendo sacado del horno con un paño a cuadros. | https://www.pexels.com/es-es/foto/pan-sujetando-horneando-hecho-en-casa-7965990/ |
| regional-8 | Tarros de colores con conservas de verduras y encurtidos caseros sobre una mesa de madera rústica. | https://www.pexels.com/es-es/foto/verduras-en-conserva-caseras-variadas-en-frascos-33984949/ |
| regional-9 | Primer plano de tarros de cristal llenos de mermeladas caseras oscuras exhibidos sobre una superficie de madera vintage. | https://www.pexels.com/es-es/foto/productos-jarras-de-vidrio-enjambres-de-cerca-10660384/ |
| regional-10 | Frascos coloridos de conserva de zanahoria exhibidos al aire libre con tapas de tela decorativas. | https://www.pexels.com/es-es/foto/conservas-de-zanahoria-caseras-frescas-en-frascos-de-vidrio-32894082/ |
| gastronomia-1 | Un chef tatuado prepara con maestría un plato gourmet con precisión y habilidad en la cocina de un restaurante. | https://www.pexels.com/es-es/foto/chef-preparando-un-plato-gourmet-en-una-cocina-profesional-36430089/ |
| gastronomia-2 | Chefs en una cocina profesional preparando y emplatando platos gourmet con precisión y trabajo en equipo. | https://www.pexels.com/es-es/foto/restaurante-mujer-hombres-cocina-6937464/ |
| gastronomia-3 | Equipo de chefs preparando masa para un evento culinario en un entorno de cocina comercial. | https://www.pexels.com/es-es/foto/comida-trabajando-hombres-masa-11330115/ |
| gastronomia-4 | Un camarero sirve una ensalada fresca y aperitivos en un acogedor ambiente de restaurante. | https://www.pexels.com/es-es/foto/persona-sosteniendo-platos-de-pasteleria-en-platos-de-ceramica-blanca-262978/ |
| gastronomia-5 | Camarera amigable sosteniendo un bloc de notas, lista para tomar pedidos en un ambiente moderno de cafetería. | https://www.pexels.com/es-es/foto/camarera-sonriente-sosteniendo-un-bloc-de-notas-en-una-cafeteria-acogedora-36766731/ |
| gastronomia-6 | Chef con chaqueta azul cocinando un plato con precisión en la estufa de una cocina de restaurante. | https://www.pexels.com/es-es/foto/comida-hombre-chef-jefe-de-cocina-15671370/ |
| gastronomia-7 | Vista desde arriba de tres panes artesanales sobre una superficie rústica, mostrando intrincados patrones de harina y su apariencia fresca. | https://www.pexels.com/es-es/foto/rustico-vista-superior-fotografia-de-comida-horneado-15634531/ |
| textil-1 | Explora un taller de tejido tradicional en Oaxaca, que muestra telares manuales y carretes de hilo coloridos. | https://www.pexels.com/es-es/foto/taller-de-tejido-tradicional-en-oaxaca-mexico-33703937/ |
| textil-2 | Tejiendo a mano hilos de tela coloridos en un telar de madera tradicional. | https://www.pexels.com/es-es/foto/mano-algodon-trapos-hilos-6634692/ |
| textil-3 | Primer plano de manos bordando un diseño de flores al aire libre, mostrando habilidad y creatividad. | https://www.pexels.com/es-es/foto/manos-arte-modelo-estampado-10542570/ |
| textil-4 | Una máquina de coser industrial instalada en un taller de manualidades con tela y herramientas. | https://www.pexels.com/es-es/foto/mesa-oficio-artesania-manualidad-15015599/ |
| textil-5 | Imagen detallada de una aguja de máquina de coser antigua. Perfecta para temas relacionados con la artesanía y la sastrería. | https://www.pexels.com/es-es/foto/primer-plano-de-una-aguja-de-maquina-de-coser-antigua-39156647/ |
| textil-6 | Una anciana practica el bordado tradicional en una mesa de trabajo en Csaroda, Hungría. | https://www.pexels.com/es-es/foto/mujer-mayor-elaborando-tela-bordada-en-csaroda-36733443/ |
| textil-7 | Vista detallada de un telar de madera con tela tejida y una cinta métrica, destacando la tejeduría tradicional. | https://www.pexels.com/es-es/foto/oficio-artesania-manualidad-destreza-6634758/ |
| textil-8 | Una hábil mujer tejedora elaborando patrones intrincados en un telar textil usando técnicas tradicionales. | https://www.pexels.com/es-es/foto/mujer-mano-modelo-estampado-5174199/ |
| textil-9 | Un acercamiento de manos trabajando en un bordado navideño festivo que representa una escena de chimenea. | https://www.pexels.com/es-es/foto/navidad-navidades-oficio-artesania-13963766/ |
| creativa-1 | Jabones hechos a mano vibrantes exhibidos sobre hojas verdes exuberantes con acentos florales, perfectos para temas ecológicos. | https://www.pexels.com/es-es/foto/hojas-naturaleza-muerta-composicion-carnoso-14017559/ |
| creativa-2 | Una persona vierte cera en tarros de vidrio para hacer velas, mostrando un oficio práctico de pequeño negocio. | https://www.pexels.com/es-es/foto/persona-vertiendo-cera-de-vela-mechas-de-vela-8272376/ |
| creativa-3 | Primer plano de unas manos dando forma a una vasija de barro en un torno de alfarero, lo que demuestra el trabajo en equipo y la destreza artesanal. | https://www.pexels.com/es-es/foto/manos-creando-una-vasija-de-arcilla-en-el-torno-de-alfarero-36739021/ |
| creativa-4 | Las velas de cáscara de huevo crean una ambientación cálida en un arreglo rústico y acogedor. | https://www.pexels.com/es-es/foto/huevos-decoracion-acostado-velas-6980161/ |
| creativa-5 | Un alfarero experto da forma a vasijas de arcilla en un torno, en un taller rústico y tradicional. | https://www.pexels.com/es-es/foto/artesano-elaborando-vasijas-de-barro-en-un-taller-tradicional-37364853/ |
| creativa-6 | Bordado artístico a mano con patrones florales en tela con diseños intrincados. | https://www.pexels.com/es-es/foto/creativo-pintura-pintando-cuadro-10566048/ |
| creativa-7 | Una selección de vibrantes velas rosas artesanales en varias formas, perfectas para la decoración del hogar. | https://www.pexels.com/es-es/foto/mesa-decoracion-del-hogar-hecho-a-mano-cera-23124087/ |
| creativa-8 | Una colección de velas esculpidas con diseños intrincados en varias formas, perfecta para la decoración. | https://www.pexels.com/es-es/foto/ligero-velas-naturaleza-muerta-decoracion-del-hogar-27549292/ |
| creativa-9 | Una artesana enfocada trabajando en la alfarería en un taller de cerámica. | https://www.pexels.com/es-es/foto/pareja-gente-mujer-creativo-9736291/ |
| creativa-10 | Imagen detallada en primer plano de vasijas de arcilla hechas a mano que muestran técnicas de alfarería artesanal. | https://www.pexels.com/es-es/foto/primer-plano-de-macetas-de-barro-hechas-a-mano-en-el-taller-37328153/ |
| creativa-11 | Vista detallada de manos cosiendo tela de patrones vibrantes, simbolizando la artesanía y el arte. | https://www.pexels.com/es-es/foto/primer-plano-de-costura-artesanal-a-mano-37758409/ |
| oficios-1 | Un hábil carpintero trabajando en una tabla de madera con una herramienta en un entorno de taller. | https://www.pexels.com/es-es/foto/madera-hombre-sin-rostro-efecto-desenfocado-5974285/ |
| oficios-2 | Un herrero trabajando y creando chispas en un entorno de taller vibrante. | https://www.pexels.com/es-es/foto/hombre-trabajando-industria-trabajador-14473241/ |
| oficios-3 | Primer plano de un herrero forjando una herradura en interiores con herramientas. | https://www.pexels.com/es-es/foto/hombre-manos-trabajando-en-pie-16273145/ |
| oficios-4 | Carpintero enfocado operando una sierra de banda mientras trabaja la madera en un taller. | https://www.pexels.com/es-es/foto/hombre-en-camisa-de-vestir-gris-sierra-de-cinta-operativa-848199/ |
| oficios-5 | Un mecánico reparando un motor de coche en un taller de reparación auto ocupado con herramientas alrededor. | https://www.pexels.com/es-es/foto/hombre-industria-coche-vehiculo-8986041/ |
| oficios-6 | Excavadora cargando un camión volquete en una cantera. Escena de equipo minero industrial. | https://www.pexels.com/es-es/foto/dia-29506742/ |
| oficios-7 | Trabajador industrial concentrado con equipo de protección revisando documentos en una fábrica en Rusia. | https://www.pexels.com/es-es/foto/trabajador-industrial-revisando-documentos-en-fabrica-32845698/ |
| oficios-8 | Dos carpinteros masculinos trabajando juntos en un taller bien equipado. | https://www.pexels.com/es-es/foto/trabajando-hombres-en-pie-de-pie-7484154/ |

## Otras imágenes

| Archivo | Origen |
|---|---|
| `public/img/camion/vista-*.webp` | Vistas del camión minero del carrusel de «Maquinaria y mecánica». Ya estaban en el proyecto y nunca tuvieron crédito publicado; el repositorio no documenta su origen. **Confirmar la procedencia con quien las aportó.** |
| `public/img/equipo/*.webp` | Siluetas temporales generadas con `scripts/equipo/retratos.mjs` (obra propia). Se reemplazan por las fotos reales del equipo. |
| `src/brand/*.svg` | Logo de CEPROC reconstruido en vector desde la carta institucional (`scripts/brand/`). |
| `src/brand/estratos.svg` | Líneas de estratos, obra propia (`scripts/brand/estratos.py`). |
| Íconos | Phosphor Icons, licencia MIT (incluida en `node_modules/@phosphor-icons/react/LICENSE`). |
| Tipografías | Manrope, DM Sans e IBM Plex Mono: SIL Open Font License 1.1 (paquetes Fontsource). |
