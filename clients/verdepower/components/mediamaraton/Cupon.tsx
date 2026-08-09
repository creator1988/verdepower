import { mediamaratonConfig } from "../../config";

type Props = {
  codigo: string;
};

export function Cupon({ codigo }: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
      <div className="flex">
        <div className="w-[70%] bg-vp-navy px-4 py-5 text-left">
          <p className="font-display text-2xl leading-tight font-black text-vp-white uppercase sm:text-3xl">
            20% de descuento
          </p>
          <p className="mt-1 text-sm font-semibold text-vp-white/90">Aerosol Verde Power</p>
          <p className="mt-2 text-[0.65rem] text-vp-white/50">
            Mediamaratón Ciudad Bonita · 16 de agosto
          </p>
        </div>

        <div className="relative flex w-[30%] flex-col items-center justify-center gap-1 border-l-2 border-dashed border-vp-navy/30 bg-vp-green px-2 py-5 text-center">
          <p className="font-mono text-xl font-bold tracking-wider text-vp-navy sm:text-2xl">
            {codigo}
          </p>
          <p className="text-[0.6rem] leading-tight font-medium text-vp-navy/70">
            Válido hasta
            <br />
            {mediamaratonConfig.cuponVigenciaHasta}
          </p>
        </div>
      </div>

      <span className="absolute top-[-10px] left-[70%] h-5 w-5 -translate-x-1/2 rounded-full bg-vp-navy" />
      <span className="absolute bottom-[-10px] left-[70%] h-5 w-5 -translate-x-1/2 rounded-full bg-vp-navy" />
    </div>
  );
}
