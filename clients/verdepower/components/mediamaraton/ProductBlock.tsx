import Image from "next/image";
import type { SVGProps } from "react";
import { aerosolVerdePower } from "../../catalogo/aerosol";

const SPRAY_BURST = [
  { size: "h-14 w-14", color: "bg-vp-green/50", delay: 0, x: -6, y: -4 },
  { size: "h-16 w-16", color: "bg-vp-blue/45", delay: 40, x: 5, y: 3 },
  { size: "h-20 w-20", color: "bg-vp-green/40", delay: 80, x: -3, y: 6 },
  { size: "h-24 w-24", color: "bg-vp-blue/35", delay: 120, x: 4, y: -5 },
  { size: "h-28 w-28", color: "bg-vp-green/30", delay: 160, x: -5, y: -2 },
  { size: "h-32 w-32", color: "bg-vp-blue/25", delay: 200, x: 3, y: 4 },
  { size: "h-36 w-36", color: "bg-vp-green/25", delay: 240, x: -2, y: -6 },
];

function IconFrio(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12" />
      <path d="M12 2 9.5 4.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5" />
    </svg>
  );
}

function IconRelaja(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14c2-6 6-10 8-10 0 4-2 6-4 8 3-1 6 0 8 3-3 2-8 3-12 1-1-.5-1.5-1.3-2-2z" />
    </svg>
  );
}

function IconLigero(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 5c-4 0-9 4-11 9-1 2.5.5 5 3 4 5-2 9-7 9-11 0-1-.5-2-1-2z" />
      <path d="M4 20c2-2 4-3 6-3" />
    </svg>
  );
}

const BULLETS = [
  { texto: "Frío que despierta el músculo", Icon: IconFrio },
  { texto: "Relaja antes del pitazo", Icon: IconRelaja },
  { texto: "Cero pesadez después de correr", Icon: IconLigero },
];

export function ProductBlock() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[420px] px-5">
      <div className="relative mx-auto flex h-[210px] w-full items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-vp-green opacity-30 blur-2xl" />

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

        <Image
          src={aerosolVerdePower.imagen}
          alt={aerosolVerdePower.nombre}
          width={257}
          height={945}
          priority
          className="vp-reveal relative z-10 h-auto max-h-[190px] w-auto max-w-[130px] object-contain"
        />
      </div>

      <ul className="mt-1 grid grid-cols-3 gap-2 text-center">
        {BULLETS.map(({ texto, Icon }) => (
          <li key={texto} className="flex flex-col items-center gap-1.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-vp-green/50 text-vp-green">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[0.68rem] leading-tight font-medium text-vp-white/80">
              {texto}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
