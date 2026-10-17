/**
 * Contenido institucional de CEPROC — fuente única.
 *
 * Todo el texto proviene del documento oficial "CEPROC_corregido_Jorge_Leopoldo_Espejo.pdf"
 * (proyecto institucional + carta de presentación firmada por la directora). No se agregan
 * datos que no figuren allí. Decisiones confirmadas por el responsable del sitio:
 *  - Identidad: logo y nombre de la carta ("Centro Productivo de Capacitación en Oficios
 *    Regionales y Minería", lema "Formación que construye futuro").
 *  - Ubicación: Rawson, San Juan (como en las páginas del proyecto).
 */

export const institution = {
  short: "CEPROC",
  name: "Centro Productivo de Capacitación en Oficios Regionales y Minería",
  motto: "Formación que construye futuro",
  tagline: "Capacitar · Producir · Trabajar · Desarrollar",
  location: "Rawson, San Juan",
  /** Encabezado de las páginas del proyecto. */
  header: "Formación, producción y desarrollo laboral",
};

export const contact = {
  phone: "2645239410",
  phoneDisplay: "264 523-9410",
  email: "araozsabrina4@gmail.com",
  place: "Rawson, San Juan",
};

/**
 * `photo`: retrato ilustrativo temporal (no es la persona). Para publicar la foto real, reemplazar
 * el archivo con el mismo nombre en public/img/equipo/ (WebP o JPG renombrado, proporción 4:5) y
 * cambiar `photoIsIllustrative` a false.
 */
export const team = [
  {
    role: "Directora",
    name: "Sabrina Araoz",
    detail: "Dirección y coordinación institucional del proyecto.",
    photo: "/img/equipo/directora.webp",
    photoIsIllustrative: true,
  },
  {
    role: "Vicedirector",
    name: "Marcelo Ortega",
    detail: "Coordinación y acompañamiento de las áreas productivas y técnicas.",
    photo: "/img/equipo/vicedirector.webp",
    photoIsIllustrative: true,
  },
];

/* ------------------------------------------------------------------ Quiénes somos */

export const about = {
  title: "Una propuesta de formación conectada con el trabajo",
  paragraphs: [
    "CEPROC se concibe como un centro de formación práctica, producción y desarrollo laboral que reúne oficios mineros, industriales, regionales, gastronómicos, de servicios, manualidades y actividades productivas. La propuesta está pensada para jóvenes y adultos que necesitan adquirir competencias concretas, fortalecer sus conocimientos o abrir una nueva posibilidad de trabajo y producción.",
    "El proyecto busca construir un puente entre la capacitación y el mundo laboral: aprender haciendo, trabajar con criterios de seguridad y calidad, desarrollar hábitos laborales y acercar a los participantes a empresas, instituciones y actores productivos del territorio.",
  ],
  purpose:
    "Formar personas con capacidades prácticas y laborales que puedan incorporarse a procesos de selección, desarrollar servicios, producir bienes o iniciar actividades productivas.",
  mission:
    "Brindar formación laboral práctica y de calidad, fortaleciendo capacidades técnicas, productivas y de servicio, y generando puentes de articulación con el mundo del trabajo.",
  vision:
    "Consolidar a CEPROC como un espacio de referencia para la capacitación en oficios regionales, industriales, mineros y productivos, articulando educación, producción y oportunidades laborales.",
  values: [
    { name: "Responsabilidad", text: "Cumplimiento de tareas, horarios y procedimientos." },
    { name: "Seguridad", text: "Prevención y cuidado de las personas, equipos y espacios." },
    { name: "Calidad", text: "Búsqueda de buenos resultados y mejora continua." },
    { name: "Respeto", text: "Convivencia, trabajo en equipo y valoración de los saberes." },
    { name: "Compromiso", text: "Formación orientada a oportunidades reales y desarrollo local." },
  ],
  principles: [
    "Formación práctica y orientada a competencias.",
    "Seguridad, responsabilidad y calidad como ejes transversales.",
    "Articulación con necesidades productivas reales.",
    "Respeto por saberes regionales, oficios y cultura del trabajo.",
    "Vinculación progresiva con empresas, municipio, instituciones y organizaciones.",
  ],
};

/* ------------------------------------------------------------------ El proyecto */

export const project = {
  title: "Del aprendizaje al trabajo",
  foundation: [
    "La diversidad productiva de San Juan requiere personas preparadas para desempeñarse en distintos ámbitos: minería, mantenimiento, industria, gastronomía, logística, servicios, producción regional y oficios. CEPROC propone concentrar esa formación en una estructura organizada, práctica y vinculada con el territorio.",
    "La propuesta no se limita a dictar clases. Busca desarrollar competencias observables mediante prácticas, simulaciones, elaboración de productos, resolución de situaciones y evaluación. En las áreas mineras se priorizan especialmente la seguridad, el mantenimiento responsable, la prevención de riesgos y el respeto por los procedimientos del sector.",
  ],
  generalObjective:
    "Crear y desarrollar un centro de capacitación laboral que prepare a jóvenes y adultos mediante formación teórica y práctica en oficios mineros, industriales, regionales, gastronómicos, manuales y de servicios, promoviendo la inserción laboral, el trabajo formal, la producción y el desarrollo local.",
  specificObjectives: [
    "Capacitar en competencias técnicas y prácticas vinculadas a la minería y la industria.",
    "Formar en seguridad, prevención de riesgos, higiene, calidad y responsabilidad laboral.",
    "Desarrollar oficios que permitan acceder a empleos, prestar servicios o producir bienes.",
    "Fortalecer la producción regional mediante alimentos, textiles, artesanías y otros productos.",
    "Recuperar y transmitir saberes tradicionales y técnicas artesanales.",
    "Generar espacios de práctica y evaluación de competencias.",
    "Construir articulaciones con el Municipio, instituciones educativas y empresas.",
    "Gestionar aportes de empresas para herramientas, insumos, equipamiento y prácticas.",
    "Promover convenios que acerquen a los egresados a procesos reales de selección laboral.",
    "Acompañar la transición entre la capacitación y el mundo del trabajo.",
  ],
  methodology: [
    "Clases prácticas, demostraciones y ejercicios.",
    "Talleres con herramientas y equipamiento adecuados al nivel formativo.",
    "Resolución de situaciones reales o simuladas.",
    "Producción de bienes y servicios como parte del aprendizaje.",
    "Evaluación por competencias y criterios previamente comunicados.",
    "Registro de asistencia, prácticas y resultados de cada participante.",
  ],
  audience: [
    "Jóvenes y adultos que buscan una primera capacitación laboral o una reconversión de oficio.",
    "Personas que necesitan fortalecer conocimientos técnicos para mejorar sus posibilidades de empleo.",
    "Trabajadores que desean incorporar nuevas competencias en minería, industria, servicios u oficios.",
    "Familias y personas interesadas en producción artesanal, regional y actividades de autoempleo.",
    "Personas que necesitan formación práctica y accesible, con acompañamiento y evaluación de competencias.",
  ],
  /** Circuito de vinculación (página 14 del proyecto). */
  pathway: [
    { step: "Capacitación", text: "Formación teórica y práctica en el trayecto elegido." },
    { step: "Evaluación", text: "Evaluación por competencias con criterios previamente comunicados." },
    { step: "Certificación", text: "Constancia de las competencias adquiridas." },
    { step: "Presentación del perfil", text: "Las empresas conocen el perfil de los egresados." },
    { step: "Selección laboral", text: "Los egresados pueden ser considerados en procesos de selección." },
  ],
  pathwayNote:
    "La certificación de CEPROC no implica contratación automática: se propone articular con empresas para que conozcan el perfil de los egresados y puedan considerarlos en sus procesos de selección, de acuerdo con sus vacantes y requisitos.",
};

/* ------------------------------------------------------------------ Áreas de formación */

export type Workshop = { name: string; goal: string };
export type Area = {
  id: string;
  /** Rótulo corto para el nodo del sistema interactivo. */
  label: string;
  /** Sección del documento. */
  section: string;
  title: string;
  summary: string;
  workshops: Workshop[];
  extraTitle?: string;
  extra?: string[];
  note?: string;
  image: string;
  imageAlt: string;
};

export const areas: Area[] = [
  {
    id: "mineros-1",
    label: "Maquinaria y mecánica",
    section: "Talleres mineros I",
    title: "Maquinaria, mecánica, electricidad y soldadura",
    summary:
      "Base de formación práctica para que los participantes conozcan herramientas, procedimientos, seguridad y competencias relacionadas con tareas técnicas y de apoyo en la actividad minera e industrial.",
    workshops: [
      { name: "Operación y mantenimiento de maquinaria pesada minera", goal: "Introducir al participante en equipos pesados, operación básica, mantenimiento preventivo, sistemas hidráulicos y mecánicos, seguridad operativa y equipos de perforación y carga." },
      { name: "Mecánica industrial y electromecánica minera", goal: "Desarrollar bases para mantenimiento de equipos, motores industriales, sistemas eléctricos, diagnóstico de fallas y mantenimiento electromecánico." },
      { name: "Electricidad industrial y de equipos mineros", goal: "Formar en electricidad básica e industrial, tableros, motores, automatización, mantenimiento y seguridad eléctrica." },
      { name: "Soldadura y fabricación metálica", goal: "Desarrollar habilidades iniciales de preparación, unión y terminación de piezas metálicas, con énfasis en seguridad, herramientas y calidad." },
      { name: "Mecánica general", goal: "Brindar conocimientos prácticos de diagnóstico, mantenimiento y reparación de sistemas mecánicos, aplicables a distintos entornos laborales." },
    ],
    extraTitle: "Prácticas previstas",
    extra: [
      "Identificación y uso seguro de herramientas.",
      "Mantenimiento preventivo y registro de tareas.",
      "Interpretación básica de componentes y sistemas.",
      "Prácticas de medición, montaje, desmontaje y diagnóstico.",
      "Procedimientos seguros para trabajos con equipos y herramientas.",
    ],
    image: "maquinaria",
    imageAlt: "Camión minero de gran porte en mantenimiento dentro de un taller.",
  },
  {
    id: "mineros-2",
    label: "Seguridad y servicios",
    section: "Talleres mineros II",
    title: "Seguridad, química, administración y servicios",
    summary:
      "Formación en prevención, procesos químicos aplicados, control operativo, gestión y servicios de apoyo para operaciones y campamentos.",
    workshops: [
      { name: "Higiene, seguridad y prevención de riesgos", goal: "Formar en identificación de riesgos, EPP, prevención de accidentes, emergencias, seguridad en campamentos y cultura preventiva." },
      { name: "Química minera y procesos químicos aplicados", goal: "Brindar fundamentos de química industrial, procesos básicos, seguridad química, manipulación responsable y cuidado ambiental." },
      { name: "Seguridad privada y control operativo", goal: "Desarrollar competencias básicas para control de accesos, prevención, vigilancia, protocolos y actuación responsable en ámbitos autorizados." },
      { name: "Administración y gestión empresarial", goal: "Capacitar en documentación, atención, registros, recursos humanos, logística, abastecimiento y sistemas básicos de gestión." },
      { name: "Limpieza industrial y ordenanza", goal: "Formar en protocolos de higiene, uso responsable de productos, mantenimiento y organización de espacios laborales." },
      { name: "Servicios gastronómicos y atención en campamentos", goal: "Capacitar en cocina, manipulación de alimentos, comedor, atención, servicio y organización de actividades gastronómicas." },
    ],
    note:
      "Las prácticas deberán realizarse con procedimientos seguros, supervisión adecuada, elementos de protección y equipamiento acorde a la actividad. La capacitación no habilita por sí sola para operar equipos o realizar tareas que requieran una licencia, matrícula o habilitación específica.",
    image: "seguridad",
    imageAlt: "Instructor ajustando un arnés de seguridad a un trabajador con casco.",
  },
  {
    id: "regional",
    label: "Alimentos y saberes regionales",
    section: "Área regional y productiva",
    title: "Producción de alimentos, saberes regionales y servicios",
    summary:
      "Conocimientos que pueden transformarse en productos y servicios para familias, instituciones, empresas, comercios y eventos. Se combina técnica, higiene, organización, costos, presentación y planificación productiva.",
    workshops: [
      { name: "Quesos", goal: "Elaboración, higiene, conservación, presentación y organización del proceso." },
      { name: "Yogures", goal: "Procesos, higiene, control, conservación y presentación de productos." },
      { name: "Viandas", goal: "Planificación, producción, porcionado, conservación, costos y distribución." },
      { name: "Menú empresarial", goal: "Diseño de menús para grupos, empresas e instituciones considerando variedad y logística." },
      { name: "Comidas de alta montaña y campamento", goal: "Planificación y preparación de alimentos para contextos de campamento y trabajo." },
      { name: "Comidas típicas", goal: "Recuperación y transmisión de recetas, técnicas y cultura gastronómica regional." },
      { name: "Pastelería y panificación", goal: "Elaboración, decoración, conservación, presentación y organización de producción." },
      { name: "Conservas", goal: "Elaboración segura, higiene, envasado, rotulado y conservación." },
      { name: "Licores artesanales", goal: "Conocimiento de procesos tradicionales, maceración y presentación dentro del marco legal y sanitario aplicable." },
      { name: "Juegos industriales", goal: "Diseño y elaboración de propuestas recreativas y productos para espacios institucionales y productivos." },
    ],
    image: "regional",
    imageAlt: "Manos amasando pan sobre una mesa enharinada.",
  },
  {
    id: "gastronomia",
    label: "Cocina y campamentos",
    section: "Gastronomía y servicios",
    title: "Capacitación para cocina, campamentos, instituciones y empresas",
    summary:
      "La gastronomía como salida formativa con múltiples aplicaciones: cocina familiar, producción de viandas, servicios para instituciones, atención de salones y apoyo a campamentos o establecimientos productivos.",
    workshops: [
      { name: "Cocina", goal: "Técnicas culinarias, organización de cocina, higiene, manipulación segura y presentación." },
      { name: "Elaboración de viandas", goal: "Planificación, producción, porcionado, conservación y distribución organizada." },
      { name: "Organización de menú empresarial", goal: "Diseño de propuestas para trabajadores, empresas, instituciones y grupos." },
      { name: "Mozos y servicio de mesa", goal: "Preparación del salón, servicio, atención al cliente, comunicación y normas de higiene." },
      { name: "Atención y servicio", goal: "Fortalecer trato con el público, organización, comunicación y calidad del servicio." },
      { name: "Alta montaña y campamento", goal: "Planificación de comidas, organización de insumos y servicio en contextos de campamento." },
      { name: "Pastelería y panificación", goal: "Producción, decoración, conservación, presentación y organización de pedidos." },
    ],
    extraTitle: "Proyección productiva",
    extra: [
      "Prácticas de producción para eventos y actividades institucionales.",
      "Elaboración de viandas para posibles clientes institucionales y empresariales.",
      "Organización de menús y costos como parte del aprendizaje.",
      "Formación en higiene y manipulación segura de alimentos.",
      "Desarrollo de productos con identidad regional.",
    ],
    image: "cocina",
    imageAlt: "Cocineros trabajando en una cocina profesional.",
  },
  {
    id: "textil",
    label: "Textil y artesanal",
    section: "Área de oficios manuales y textiles",
    title: "Formación artesanal, textil y creativa",
    summary:
      "Una línea de formación accesible y productiva para personas interesadas en oficios manuales: rescatar saberes, enseñar técnicas paso a paso y transformar el aprendizaje en productos con calidad, terminación y posibilidades de comercialización.",
    workshops: [
      { name: "Historia del tejido", goal: "Conocer la evolución del tejido, herramientas, técnicas y valor cultural." },
      { name: "Tejido", goal: "Desarrollar habilidades para elaborar prendas, accesorios y productos tejidos." },
      { name: "Bordado", goal: "Aprender técnicas decorativas y funcionales para personalizar productos." },
      { name: "Costura hogareña e industrial", goal: "Manejo de máquinas, confección, reparación y terminaciones." },
      { name: "Patronaje", goal: "Interpretar, diseñar y adaptar moldes para prendas y productos." },
      { name: "Tejido tunecino", goal: "Incorporar técnicas específicas para piezas textiles y accesorios." },
      { name: "Telar", goal: "Conocer herramientas y técnicas básicas para producir piezas textiles." },
      { name: "Macramé", goal: "Aprender nudos y composiciones para decoración, accesorios y productos." },
      { name: "Amigurumis", goal: "Desarrollar técnicas de tejido y armado de figuras y productos artesanales." },
    ],
    extraTitle: "Resultado esperado",
    extra: [
      "Que cada participante pueda completar productos, comprender materiales y herramientas, mejorar terminaciones, organizar su trabajo y calcular de manera básica materiales y tiempos de producción.",
    ],
    image: "textil",
    imageAlt: "Manos tejiendo en un telar con hilos azules.",
  },
  {
    id: "creativa",
    label: "Nuevos talleres creativos",
    section: "Área personal, artesanal y creativa",
    title: "Nuevos talleres para ampliar oportunidades productivas",
    summary:
      "Talleres artesanales y creativos orientados a productos de uso, decoración y comercialización, con atención a materiales, terminaciones y presentación.",
    workshops: [
      { name: "Jabones artesanales", goal: "Aprender procesos, materiales, higiene, seguridad, moldes, presentación y rotulado responsable." },
      { name: "Velas artesanales", goal: "Elaborar velas decorativas y funcionales, trabajando moldes, terminaciones y presentación." },
      { name: "Cerámica", goal: "Introducir técnicas de modelado, texturas, secado, terminación y decoración." },
      { name: "Reciclaje y reutilización", goal: "Transformar materiales recuperables en objetos útiles, decorativos o productivos." },
      { name: "Artesanías regionales", goal: "Desarrollar productos artesanales inspirados en identidad y recursos locales." },
      { name: "Pintura decorativa", goal: "Aplicar técnicas sobre diferentes superficies para productos de uso y decoración." },
      { name: "Bijouterie y accesorios", goal: "Elaborar accesorios mediante armado, combinación de materiales y terminaciones." },
      { name: "Decoración y objetos para el hogar", goal: "Diseñar productos decorativos con criterios de utilidad, presentación y calidad." },
      { name: "Papelería y productos personalizados", goal: "Crear tarjetas, etiquetas, packaging y piezas personalizadas." },
      { name: "Cestería y fibras", goal: "Explorar técnicas básicas de trenzado, armado y terminación de piezas." },
      { name: "Reciclaje textil", goal: "Reutilizar telas y prendas para crear nuevos productos y reducir desperdicios." },
    ],
    note:
      "En talleres que involucren productos químicos, alimentos o actividades sujetas a habilitación, se trabajará con criterios de seguridad y se contemplarán las normas sanitarias y legales que correspondan.",
    image: "creativa",
    imageAlt: "Manos modelando arcilla en un torno de alfarería.",
  },
  {
    id: "oficios",
    label: "Carpintería y oficios",
    section: "Oficios productivos y servicios",
    title: "Carpintería, metalúrgica, mantenimiento, logística y otros oficios",
    summary:
      "Oficios productivos y de servicios con competencias que atraviesan todas las áreas: uso responsable de herramientas, orden, mantenimiento preventivo y control básico de calidad.",
    workshops: [
      { name: "Carpintería", goal: "Trabajo de madera, herramientas, armado, terminaciones y seguridad." },
      { name: "Metalúrgica", goal: "Operaciones básicas con metales, herramientas, armado, terminaciones y prevención." },
      { name: "Herrería", goal: "Corte, armado, uniones y elaboración de estructuras y objetos metálicos." },
      { name: "Mantenimiento general", goal: "Mantenimiento preventivo, orden, reparación básica y cuidado de instalaciones." },
      { name: "Mecánica", goal: "Diagnóstico, mantenimiento y reparación de sistemas mecánicos." },
      { name: "Transporte y logística", goal: "Organización de cargas, recorridos, documentación, almacenamiento y distribución." },
      { name: "Administración e informática", goal: "Documentación, registros, herramientas digitales, atención y organización." },
      { name: "Desarrollo de proyectos productivos", goal: "Planificación básica, costos, recursos, organización y presentación de proyectos." },
    ],
    extraTitle: "Competencias que atraviesan los oficios",
    extra: [
      "Uso responsable de herramientas y equipos.",
      "Orden del puesto de trabajo.",
      "Mantenimiento preventivo.",
      "Interpretación de instrucciones.",
      "Trabajo en equipo y comunicación.",
      "Control básico de calidad.",
      "Cálculo inicial de materiales, tiempos y costos.",
    ],
    image: "carpinteria",
    imageAlt: "Carpinteros trabajando con máquinas en un taller de madera.",
  },
];

/* ------------------------------------------------------------------ Seguridad y empleabilidad */

export const safety = {
  title: "Seguridad como eje transversal",
  employability:
    "La propuesta apunta a que cada egresado cuente con evidencias de aprendizaje y competencias que pueda presentar en búsquedas laborales.",
  transversal: [
    "Trabajo en equipo, comunicación y responsabilidad.",
    "Uso correcto de herramientas y elementos de protección personal.",
    "Interpretación de procedimientos e instrucciones de trabajo.",
    "Orden, mantenimiento, cuidado de equipos y registro de tareas.",
    "Conciencia ambiental y uso responsable de materiales.",
  ],
  miningTracks: [
    "Operación y mantenimiento de maquinaria pesada minera.",
    "Mecánica industrial y electromecánica minera.",
    "Electricidad industrial y de equipos mineros.",
    "Soldadura y fabricación metálica.",
    "Higiene, seguridad y prevención de riesgos.",
    "Química minera y procesos químicos aplicados.",
    "Seguridad privada y control operativo.",
    "Administración, logística y gestión documental.",
    "Limpieza industrial y ordenanza.",
    "Servicios gastronómicos y atención en campamentos.",
  ],
};

/* ------------------------------------------------------------------ Articulación */

export const municipality = {
  title: "Un espacio físico para hacer realidad CEPROC",
  intro:
    "CEPROC solicita al Intendente del Departamento Rawson y a las áreas municipales correspondientes el acompañamiento institucional para poner en marcha el proyecto y evaluar la asignación, cesión, préstamo o gestión de un espacio físico adecuado para el desarrollo de los talleres.",
  requests: [
    "Un espacio físico municipal o gestionado por el Municipio que permita desarrollar clases teóricas y prácticas.",
    "Sectores diferenciados o adaptables para talleres de minería, oficios, gastronomía, textiles y manualidades.",
    "Acompañamiento para evaluar condiciones de seguridad, servicios y adecuación del lugar.",
    "Articulación con áreas municipales, instituciones educativas y organismos que puedan fortalecer la propuesta.",
    "Acompañamiento institucional para presentar CEPROC ante empresas y actores del sector productivo.",
    "Evaluación conjunta de convenios de cooperación y mecanismos de seguimiento.",
  ],
  reason:
    "Contar con un espacio estable permitiría organizar calendarios, equipamiento, prácticas y trayectorias de formación, evitando que la capacitación dependa de espacios ocasionales y facilitando una planificación anual.",
  commitments: [
    "Organizar los talleres y equipos de trabajo.",
    "Diseñar programas, objetivos y prácticas por área.",
    "Registrar asistencia y desempeño.",
    "Cuidar y organizar el espacio y los materiales asignados.",
    "Presentar informes de avance y resultados cuando corresponda.",
  ],
};

export const companies = {
  title: "Puente hacia el empleo formal",
  intro:
    "CEPROC propone gestionar convenios de cooperación con empresas mineras, industriales y proveedoras de servicios para fortalecer el equipamiento de los talleres y acercar la formación a las necesidades reales del sector.",
  contributions: [
    "Donación o aporte de herramientas, máquinas, elementos de protección e insumos que puedan utilizarse en prácticas.",
    "Aportes de materiales de descarte o reutilizables aptos para formación, conforme a las normas de seguridad.",
    "Equipamiento para talleres de mecánica, electricidad, soldadura, seguridad, química y mantenimiento.",
    "Charlas técnicas, visitas, demostraciones y participación de especialistas.",
    "Orientación sobre perfiles y competencias que las empresas requieren.",
    "Posibilidad de prácticas, visitas formativas o experiencias de acercamiento al mundo laboral, según disponibilidad y normativa.",
  ],
  commitment:
    "Una vez que los participantes completen y aprueben los trayectos correspondientes, CEPROC buscará que las empresas conozcan sus perfiles y puedan considerarlos para vacantes y procesos de selección, de acuerdo con los requisitos de cada puesto. Esto apunta a ampliar las posibilidades de acceso a empleo registrado, digno y con condiciones laborales formales, sin presentar la contratación como una garantía automática.",
  result:
    "Formar personas que lleguen al proceso de selección con conocimientos prácticos, hábitos de trabajo, formación en seguridad y una constancia de las competencias adquiridas.",
};

/* ------------------------------------------------------------------ Beneficios */

export const benefits = {
  rawson: [
    "Mayor disponibilidad de personas capacitadas en oficios y servicios.",
    "Fortalecimiento de capacidades vinculadas con minería, industria y producción regional.",
    "Impulso a la formación laboral de jóvenes y adultos.",
    "Generación de nuevos conocimientos aplicables a emprendimientos productivos y servicios.",
    "Preservación y transmisión de saberes artesanales y regionales.",
    "Creación de vínculos de cooperación entre Municipio, instituciones, empresas y comunidad.",
    "Posibilidad de desarrollar productos y servicios que atiendan necesidades locales.",
    "Contribución a una cultura de trabajo, seguridad, responsabilidad y capacitación continua.",
  ],
  people: [
    "Acceso a capacitación práctica y organizada.",
    "Desarrollo de competencias técnicas y laborales.",
    "Mejora de la preparación para búsquedas de empleo.",
    "Posibilidad de producir bienes o prestar servicios.",
    "Herramientas para el autoempleo y la economía familiar.",
    "Conocimientos de seguridad y organización del trabajo.",
    "Acompañamiento para vincular formación y oportunidades laborales.",
  ],
  closing:
    "Por medio del presente proyecto, CEPROC solicita al Intendente del Departamento Rawson la posibilidad de mantener una reunión institucional para presentar la propuesta, evaluar un espacio físico para su funcionamiento y analizar mecanismos de articulación con áreas municipales, instituciones educativas y empresas mineras e industriales.",
};

/**
 * Menú principal. `match`: secciones que encienden cada entrada al recorrer la página.
 * Orden del sitio: Capacitaciones → La institución (Quiénes somos, El proyecto, Articulación,
 * Beneficios) → Contacto.
 */
export const nav = [
  { href: "#areas", label: "Capacitaciones", match: ["areas", "seguridad"] },
  { href: "#quienes-somos", label: "La institución", match: ["quienes-somos"] },
  { href: "#el-proyecto", label: "El proyecto", match: ["el-proyecto", "articulacion", "beneficios"] },
  { href: "#contacto", label: "Contacto", match: ["contacto"] },
] as const;
