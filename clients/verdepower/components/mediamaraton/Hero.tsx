const SPEED_LINES = [
  { top: "18%", width: "55%", left: "0%", rotate: -12 },
  { top: "34%", width: "70%", left: "8%", rotate: -12 },
  { top: "50%", width: "45%", left: "-4%", rotate: -12 },
  { top: "66%", width: "62%", left: "10%", rotate: -12 },
  { top: "80%", width: "38%", left: "2%", rotate: -12 },
];

export function Hero() {
  return (
    <header className="relative px-5 pt-14 pb-8 text-center bg-[radial-gradient(ellipse_at_top,_rgba(44,95,45,0.55)_0%,_rgba(30,66,32,0)_65%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.12]">
        {SPEED_LINES.map((line, i) => (
          <span
            key={i}
            className="absolute h-px bg-vp-cream"
            style={{
              top: line.top,
              left: line.left,
              width: line.width,
              transform: `rotate(${line.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <h1 className="font-serif relative mx-auto max-w-[22rem] text-[2rem] font-semibold leading-[1.15] text-vp-cream sm:max-w-lg sm:text-5xl">
        Para cuerpos que no se pueden dar el lujo de parar
      </h1>
      <p className="relative mx-auto mt-4 inline-flex max-w-[19rem] -translate-x-2 -rotate-1 items-center justify-center rounded-full border border-vp-moss/30 bg-vp-cream/5 px-3 py-1.5 text-xs font-medium tracking-wide text-vp-moss sm:max-w-none sm:translate-x-3 sm:text-base">
        16 de agosto · Mediamaratón Ciudad Bonita · Bucaramanga
      </p>
    </header>
  );
}
