"use client";

import { useState, type FormEvent, type SVGProps } from "react";

type MomentoActivacion = "antes" | "despues";

type Props = {
  onSuccess: (nombre: string, whatsapp: string) => void;
};

function IconPerson(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

function IconPhone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3h3l1.5 4.5L8 9.5a12 12 0 0 0 6.5 6.5l2-2.5L21 15v3a2 2 0 0 1-2 2C11.5 20 4 12.5 4 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconShoe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 15.5c0-1.5 1-2.1 2-2.6 1.5-.7 2.5-1.8 3.5-3 .6-.7 1.2-1 2-.7l4 1.5c1 .4 1.7 1.2 2 2.2l.4 1.3c.3 1 1 1.3 2 1.3H21v2a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <path d="M8.5 9.5 10 12" />
    </svg>
  );
}

function IconDroplet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />
    </svg>
  );
}

function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function CaptureForm({ onSuccess }: Props) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [momento, setMomento] = useState<MomentoActivacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (nombre.trim().length < 2 || whatsapp.trim().length < 7) {
      setError("Revisa tu nombre y tu WhatsApp.");
      return;
    }

    if (!momento) {
      setError("Cuéntanos si estás antes o después de correr.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          whatsapp: whatsapp.trim(),
          momentoActivacion: momento,
        }),
      });

      if (!res.ok) {
        throw new Error("request-failed");
      }

      onSuccess(nombre.trim(), whatsapp.trim());
    } catch {
      setError("No pudimos guardar tus datos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const opciones: { value: MomentoActivacion; label: string; Icon: typeof IconShoe }[] = [
    { value: "antes", label: "Antes de correr", Icon: IconShoe },
    { value: "despues", label: "Después de correr", Icon: IconDroplet },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[420px] flex-col gap-4 px-5 py-8"
    >
      <div className="relative">
        <IconPerson className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-vp-ink/40" />
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-xl bg-vp-cream py-3 pr-4 pl-11 text-vp-ink placeholder-vp-ink/40 outline-none ring-2 ring-transparent focus:ring-vp-moss"
          autoComplete="name"
        />
      </div>
      <div className="relative">
        <IconPhone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-vp-ink/40" />
        <input
          type="tel"
          placeholder="Tu WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-xl bg-vp-cream py-3 pr-4 pl-11 text-vp-ink placeholder-vp-ink/40 outline-none ring-2 ring-transparent focus:ring-vp-moss"
          autoComplete="tel"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {opciones.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMomento(value)}
            aria-pressed={momento === value}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 text-sm font-semibold transition-colors duration-300 ${
              momento === value
                ? "border-vp-moss bg-vp-moss text-vp-ink"
                : "border-vp-cream/50 bg-vp-forest/60 text-vp-cream"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${momento === value ? "vp-icon-pop" : ""}`} />
            {label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-xl bg-gradient-to-b from-[#97BC62] to-[#6B8E4E] px-6 py-3 text-base font-bold text-vp-ink shadow-[0_10px_25px_-6px_rgba(151,188,98,0.55)] transition duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
      >
        {loading ? "Enviando..." : "Reclamar mi descuento"}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-vp-cream/50">
        <IconLock className="h-3.5 w-3.5" />
        Tus datos están seguros · Hecho en Colombia
      </p>
    </form>
  );
}
