"use client";

import { useState, type FormEvent } from "react";

const FETCH_TIMEOUT_MS = 12000;

export function PanelLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch("/api/panel-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setError("Contraseña incorrecta.");
        return;
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "La conexión está muy lenta. Intenta de nuevo."
          : "No pudimos verificar la contraseña. Intenta de nuevo."
      );
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-vp-white/10 bg-vp-blue/30 p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
      >
        <h1 className="font-display text-center text-2xl font-black tracking-tight text-vp-white uppercase">
          Panel Mediamaratón
        </h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          className="rounded-xl bg-vp-white px-4 py-3 text-vp-navy outline-none ring-2 ring-transparent focus:ring-vp-green"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="rounded-xl bg-vp-green px-6 py-3 text-base font-bold text-vp-navy shadow-[0_10px_25px_-6px_rgba(111,174,45,0.55)] transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
