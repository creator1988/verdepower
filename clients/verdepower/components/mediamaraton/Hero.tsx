const SPEED_LINES = [
  { top: "15%", width: "50%", left: "0%" },
  { top: "32%", width: "65%", left: "6%" },
  { top: "50%", width: "40%", left: "-4%" },
  { top: "68%", width: "58%", left: "8%" },
  { top: "84%", width: "34%", left: "0%" },
];

export function Hero() {
  return (
    <header className="relative px-5 pt-8 pb-3 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.1]"
      >
        {SPEED_LINES.map((line, i) => (
          <span
            key={i}
            className="absolute h-px -rotate-12 bg-vp-white"
            style={{ top: line.top, left: line.left, width: line.width }}
          />
        ))}
      </div>

      <h1 className="font-display relative mx-auto max-w-[20rem] text-[1.75rem] leading-[1.05] font-black tracking-tight text-vp-white uppercase sm:max-w-md sm:text-4xl">
        No vas a correr sin activarte
      </h1>
      <p className="relative mt-2 text-xs font-semibold tracking-wide text-vp-green uppercase sm:text-sm">
        Mediamaratón Ciudad Bonita · Bucaramanga · 16 de agosto
      </p>
    </header>
  );
}
