export const verdepowerConfig = {
  clientId: process.env.VERDEPOWER_CLIENT_ID ?? "",
  whatsappNumber: "573176408253",
};

export const mediamaratonConfig = {
  canalId: process.env.MEDIAMARATON_CANAL_ID ?? "",
  cuponVigenciaHasta: "23 de agosto de 2026",
  mensajeWhatsapp: (codigo: string) =>
    `¡Hola! Vengo de la Mediamaratón Ciudad Bonita, ya me registré y mi código de activación es ${codigo}`,
};
