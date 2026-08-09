"use client";

import { useState, type FormEvent } from "react";

export function PanelLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/panel-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Contraseña incorrecta.");
        return;
      }

      window.location.reload();
    } catch {
      setError("No pudimos verificar la contraseña. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-[radial-gradient(circle_at_center,_#E7F0DC_0%,_#FBFBF8_75%)] p-8 shadow-[0_30px_60px_-20px_rgba(30,66,32,0.45)]"
      >
        <h1 className="text-center font-serif text-2xl font-semibold text-vp-ink">
          Panel Mediamaratón
        </h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          className="rounded-xl bg-white px-4 py-3 text-vp-ink outline-none ring-2 ring-transparent focus:ring-vp-moss"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="rounded-xl bg-gradient-to-b from-[#97BC62] to-[#6B8E4E] px-6 py-3 text-base font-bold text-vp-ink shadow-[0_10px_25px_-6px_rgba(151,188,98,0.55)] transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
