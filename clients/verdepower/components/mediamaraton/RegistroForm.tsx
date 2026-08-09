"use client";

import { useState, type FormEvent, type SVGProps } from "react";

type Props = {
  onSuccess: (codigo: string, nombre: string) => void;
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

export function RegistroForm({ onSuccess }: Props) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (nombre.trim().length < 2) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (whatsapp.replace(/\D/g, "").length < 10) {
      setError("Escribe un WhatsApp válido (10 dígitos).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), whatsapp: whatsapp.trim() }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || typeof data?.codigo !== "string") {
        throw new Error("request-failed");
      }

      onSuccess(data.codigo, nombre.trim());
    } catch {
      setError("No pudimos guardar tu registro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[420px] flex-col gap-3 px-5 pt-3 pb-5"
    >
      <div>
        <label
          htmlFor="nombre"
          className="mb-1 block text-[0.68rem] font-semibold tracking-wide text-vp-white/60 uppercase"
        >
          Tu nombre
        </label>
        <div className="relative">
          <IconPerson className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-vp-navy/40" />
          <input
            id="nombre"
            type="text"
            placeholder="Nombre y apellido"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-xl bg-vp-white py-3 pr-4 pl-11 text-vp-navy placeholder-vp-navy/35 outline-none ring-2 ring-transparent focus:ring-vp-green"
            autoComplete="name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="whatsapp"
          className="mb-1 block text-[0.68rem] font-semibold tracking-wide text-vp-white/60 uppercase"
        >
          Tu WhatsApp
        </label>
        <div className="relative">
          <IconPhone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-vp-navy/40" />
          <input
            id="whatsapp"
            type="tel"
            inputMode="numeric"
            placeholder="Ej. 3176408253"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-xl bg-vp-white py-3 pr-4 pl-11 text-vp-navy placeholder-vp-navy/35 outline-none ring-2 ring-transparent focus:ring-vp-green"
            autoComplete="tel"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 min-h-[44px] rounded-xl bg-vp-green px-6 py-3 text-base font-black tracking-tight text-vp-navy uppercase shadow-[0_10px_25px_-6px_rgba(111,174,45,0.55)] transition duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
      >
        {loading ? "Enviando..." : "Quiero mi código de activación"}
      </button>
    </form>
  );
}
