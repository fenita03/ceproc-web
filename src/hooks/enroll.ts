/**
 * Puentes entre secciones sin estado global: cualquier botón puede abrir el formulario
 * «Capacitate con nosotros» (con área y taller preelegidos) o mostrar un área en el catálogo.
 */
export type EnrollPreset = { area?: string; workshop?: string };

export const ENROLL_EVENT = "ceproc:enroll";
export const AREA_EVENT = "ceproc:area";

export const openEnroll = (preset: EnrollPreset = {}) =>
  window.dispatchEvent(new CustomEvent<EnrollPreset>(ENROLL_EVENT, { detail: preset }));

/** Elige un área en «Capacitaciones» y lleva la vista hasta las pestañas. */
export const showArea = (id: string) => {
  window.dispatchEvent(new CustomEvent<string>(AREA_EVENT, { detail: id }));
  document.getElementById("areas")?.scrollIntoView({ block: "start" });
};
