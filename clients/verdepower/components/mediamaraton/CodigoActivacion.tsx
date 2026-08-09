import type { SVGProps } from "react";
import { verdepowerConfig, mediamaratonConfig } from "../../config";
import { Cupon } from "./Cupon";

type Props = {
  nombre: string;
  codigo: string;
};

function IconCamera(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function CodigoActivacion({ nombre, codigo }: Props) {
  const primerNombre = nombre.trim().split(/\s+/)[0] ?? nombre;
  const urlWhatsapp = `https://wa.me/${verdepowerConfig.whatsappNumber}?text=${encodeURIComponent(
    mediamaratonConfig.mensajeWhatsapp(codigo)
  )}`;

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-5 pt-3 pb-5 text-center">
      <p className="font-display text-lg font-black tracking-tight text-vp-white uppercase">
        ¡Listo, {primerNombre}!
      </p>

      <div className="w-full rounded-2xl border-2 border-vp-green bg-vp-blue/30 px-6 py-6">
        <p className="text-xs font-semibold tracking-widest text-vp-green uppercase">
          Tu código de activación
        </p>
        <p className="font-display mt-2 text-5xl font-black tracking-[0.2em] text-vp-white sm:text-6xl">
          {codigo}
        </p>
      </div>

      <p className="text-sm font-medium text-vp-white/80">
        Muestra este código en el stand Verde Power para activarte
      </p>

      <Cupon codigo={codigo} />

      <a
        href={urlWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full min-h-[44px] rounded-xl bg-[#25D366] px-6 py-3 text-base font-bold text-vp-navy transition duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
      >
        Enviar mi código por WhatsApp
      </a>

      <p className="flex items-center justify-center gap-1.5 rounded-full border border-vp-white/20 px-4 py-2 text-xs text-vp-white/50">
        <IconCamera className="h-3.5 w-3.5" />
        Guarda una captura de pantalla de esta pantalla
      </p>
    </div>
  );
}
