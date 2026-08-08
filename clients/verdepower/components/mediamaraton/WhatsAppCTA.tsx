import { verdepowerConfig, mediamaratonConfig } from "../../config";

export function WhatsAppCTA() {
  const url = `https://wa.me/${verdepowerConfig.whatsappNumber}?text=${encodeURIComponent(
    mediamaratonConfig.mensajeWhatsapp
  )}`;

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-3 px-5 py-8 text-center">
      <p className="text-sm text-vp-cream/70">¡Listo! Ya guardamos tus datos.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-xl bg-[#25D366] px-6 py-4 text-lg font-bold text-vp-ink transition active:scale-[0.98]"
      >
        Abrir WhatsApp y reclamar
      </a>
    </div>
  );
}
