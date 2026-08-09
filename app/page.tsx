import Link from "next/link";

export default function GanchoPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-vp-navy px-6 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-vp-blue opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-vp-green opacity-15 blur-3xl" />
        <div className="vp-noise absolute inset-0" />
      </div>

      <Link
        href="/mediamaraton"
        className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-6 py-10"
      >
        <h1 className="font-display max-w-sm text-4xl leading-[1.05] font-black tracking-tight text-vp-white uppercase sm:max-w-lg sm:text-6xl">
          Yo <span className="text-vp-green">NO CORRO</span> la Media Maratón
        </h1>

        <p className="text-base font-semibold tracking-wide text-vp-white/70 uppercase sm:text-lg">
          Te explico a continuación...
        </p>

        <span className="vp-bounce mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-vp-white/30 text-vp-white/70">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 4v16M6 14l6 6 6-6" />
          </svg>
        </span>
      </Link>
    </main>
  );
}
