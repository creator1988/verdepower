"use client";

import { useState, type FormEvent } from "react";

type MomentoActivacion = "antes" | "despues";

type Props = {
  onSuccess: (nombre: string, whatsapp: string) => void;
};

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

  const opciones: { value: MomentoActivacion; label: string }[] = [
    { value: "antes", label: "Antes de correr" },
    { value: "despues", label: "Después de correr" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[420px] flex-col gap-3 px-5 py-8"
    >
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="rounded-xl bg-vp-cream px-4 py-3 text-vp-ink placeholder-vp-ink/40 outline-none ring-2 ring-transparent focus:ring-vp-moss"
        autoComplete="name"
      />
      <input
        type="tel"
        placeholder="Tu WhatsApp"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        className="rounded-xl bg-vp-cream px-4 py-3 text-vp-ink placeholder-vp-ink/40 outline-none ring-2 ring-transparent focus:ring-vp-moss"
        autoComplete="tel"
      />

      <div className="grid grid-cols-2 gap-3">
        {opciones.map((opcion) => (
          <button
            key={opcion.value}
            type="button"
            onClick={() => setMomento(opcion.value)}
            aria-pressed={momento === opcion.value}
            className={`rounded-xl border px-3 py-4 text-sm font-semibold transition ${
              momento === opcion.value
                ? "border-vp-moss bg-vp-moss text-vp-ink"
                : "border-vp-cream/25 bg-vp-forest/40 text-vp-cream"
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 rounded-xl bg-vp-moss px-6 py-3 text-base font-bold text-vp-ink transition active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Reclamar mi descuento"}
      </button>
    </form>
  );
}
