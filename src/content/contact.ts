/**
 * Datos oficiales de contacto de CEPROC — fuente única para todo el sitio (cabecera, portada,
 * acceso flotante, asistente, Contacto y pie). Cambiar un dato acá lo cambia en toda la web.
 */

/** Teléfono y WhatsApp oficial: (264) 556-3755, San Juan. */
const PHONE_LOCAL = "2645563755";

export const contact = {
  /** Número local de 10 dígitos (característica 264 + número). */
  phone: PHONE_LOCAL,
  phoneDisplay: "264 556-3755",
  /** Formato internacional para llamadas: +54 264 556-3755. */
  tel: `+54${PHONE_LOCAL}`,
  /** Formato internacional de WhatsApp para celulares de Argentina: 54 + 9 + característica + número. */
  whatsapp: `549${PHONE_LOCAL}`,
  email: "araozsabrina4@gmail.com",
  place: "Rawson, San Juan",
  instagram: {
    user: "ceproc_oficial",
    url: "https://www.instagram.com/ceproc_oficial/",
  },
} as const;

export const whatsappHref = (message: string) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;

/** Mensaje inicial de los accesos directos (flotante, Contacto y pie). */
export const WHATSAPP_GREETING = "Hola, CEPROC. Quiero consultar por las capacitaciones.";
export const generalInquiryUrl = whatsappHref(WHATSAPP_GREETING);
