import Image from "next/image";
import { aerosolVerdePower } from "../../catalogo/aerosol";

const SPRAY_BURST = [
  { size: "h-16 w-16", color: "bg-vp-moss/50", delay: 0, x: -6, y: -4 },
  { size: "h-20 w-20", color: "bg-vp-forest/35", delay: 40, x: 5, y: 3 },
  { size: "h-24 w-24", color: "bg-vp-moss/45", delay: 80, x: -3, y: 6 },
  { size: "h-28 w-28", color: "bg-vp-forest/30", delay: 120, x: 4, y: -5 },
  { size: "h-32 w-32", color: "bg-vp-moss/35", delay: 160, x: -5, y: -2 },
  { size: "h-36 w-36", color: "bg-vp-forest/25", delay: 200, x: 3, y: 4 },
  { size: "h-40 w-40", color: "bg-vp-moss/30", delay: 240, x: -2, y: -6 },
];

export function ProductBlock() {
  return (
    <section className="relative z-10 mx-auto -mt-10 w-full max-w-[420px] px-5 sm:-mt-14">
      <div className="relative rounded-3xl bg-[radial-gradient(circle_at_center,_#E7F0DC_0%,_#FBFBF8_75%)] px-8 py-12 text-center shadow-[0_30px_60px_-20px_rgba(30,66,32,0.45)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-vp-cream/10 blur-2xl"
        />

        <div className="relative mx-auto flex h-64 w-44 items-center justify-center overflow-hidden sm:h-72 sm:w-52">
          <div className="absolute h-40 w-40 rounded-full bg-vp-moss opacity-40 blur-2xl sm:h-48 sm:w-48" />

          {SPRAY_BURST.map((puff, i) => (
            <span
              key={i}
              className={`vp-mist-circle absolute rounded-full ${puff.size} ${puff.color}`}
              style={{
                animationDelay: `${puff.delay}ms`,
                marginLeft: `${puff.x}px`,
                marginTop: `${puff.y}px`,
              }}
            />
          ))}

          <div className="absolute bottom-3 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-vp-ink/30 blur-md sm:w-28" />

          <Image
            src={aerosolVerdePower.imagen}
            alt={aerosolVerdePower.nombre}
            width={257}
            height={945}
            priority
            className="vp-reveal relative z-10 h-auto max-h-[220px] w-auto max-w-[140px] object-contain rounded-2xl sm:max-h-[260px] sm:max-w-[160px]"
          />
        </div>

        <p className="mt-5 [text-shadow:none] filter-none text-base font-semibold text-vp-ink sm:text-lg">
          {aerosolVerdePower.nombre}
          <span className="font-normal"> — {aerosolVerdePower.beneficio}</span>
        </p>
      </div>
    </section>
  );
}
