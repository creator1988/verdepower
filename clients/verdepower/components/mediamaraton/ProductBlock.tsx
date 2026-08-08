import Image from "next/image";
import { aerosolVerdePower } from "../../catalogo/aerosol";

export function ProductBlock() {
  return (
    <section className="mx-auto w-full max-w-[420px] px-5">
      <div className="rounded-3xl bg-vp-cream px-6 py-8 text-center shadow-xl">
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          <span className="vp-mist-circle absolute h-24 w-24 rounded-full bg-vp-moss/50" />
          <span
            className="vp-mist-circle absolute h-32 w-32 rounded-full bg-vp-forest/30"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="vp-mist-circle absolute h-40 w-40 rounded-full bg-vp-moss/30"
            style={{ animationDelay: "240ms" }}
          />

          <Image
            src={aerosolVerdePower.imagen}
            alt={aerosolVerdePower.nombre}
            width={200}
            height={200}
            priority
            className="vp-reveal relative z-10 rounded-2xl"
          />
        </div>

        <p className="mt-5 text-base font-semibold text-vp-ink sm:text-lg">
          {aerosolVerdePower.nombre}
          <span className="font-normal"> — {aerosolVerdePower.beneficio}</span>
        </p>
      </div>
    </section>
  );
}
