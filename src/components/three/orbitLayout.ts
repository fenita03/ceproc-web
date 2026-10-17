/** Disposición compartida del núcleo orbital (escena 3D y versión plana en SVG). */
export const ORBITS = [
  { r: 0.78, tiltX: -1.12, tiltZ: -0.1 },
  { r: 1.08, tiltX: -1.14, tiltZ: 0.05 },
  { r: 1.4, tiltX: -1.12, tiltZ: 0.14 },
];

/**
 * Órbita y fase de cada área (en el orden del documento). Las tres órbitas giran juntas y las
 * áreas ocupan siete ángulos repartidos en partes iguales: los rótulos nunca se superponen.
 */
export const NODE_ORBIT = [2, 1, 2, 1, 2, 0, 1];
export const NODE_PHASE = NODE_ORBIT.map((_, i) => Math.PI / 2 - 0.35 - (i * 2 * Math.PI) / 7);

/** Radio libre alrededor del logo central (la conexión dorada nace en este borde). */
export const CORE_R = 0.3;
