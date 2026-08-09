"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Registro = {
  id: string;
  nombre: string;
  telefono: string;
  codigo: string;
  canjeado: boolean;
  hora: string;
};

type PanelData = {
  total: number;
  canjeados: number;
  porHora: { hora: string; cantidad: number }[];
  registros: Registro[];
};

const POLL_INTERVAL_MS = 18000;
const FETCH_TIMEOUT_MS = 12000;

function fetchConTimeout(input: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeoutId)
  );
}

export function PanelDashboard() {
  const [data, setData] = useState<PanelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [pendientes, setPendientes] = useState<Set<string>>(new Set());
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchConTimeout("/api/panel-data", { cache: "no-store" });

      if (res.status === 401) {
        window.location.href = "/mediamaraton/panel";
        return;
      }
      if (!res.ok) throw new Error("request-failed");

      const json: PanelData = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      const timeoutMsg = "La conexión está lenta y no pudimos cargar los datos.";
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? timeoutMsg
          : "No pudimos actualizar los datos."
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  async function toggleCanjeado(id: string) {
    setPendientes((prev) => new Set(prev).add(id));
    try {
      const res = await fetchConTimeout("/api/panel-canjear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("request-failed");
      const { canjeadoEn } = await res.json();

      setData((prev) => {
        if (!prev) return prev;
        const canjeado = Boolean(canjeadoEn);
        const registros = prev.registros.map((r) => (r.id === id ? { ...r, canjeado } : r));
        const canjeados = registros.filter((r) => r.canjeado).length;
        return { ...prev, registros, canjeados };
      });
    } catch {
      setError("No pudimos actualizar el canje. Intenta de nuevo.");
    } finally {
      setPendientes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function cerrarSesion() {
    setCerrandoSesion(true);
    try {
      await fetchConTimeout("/api/panel-auth", { method: "DELETE" });
    } finally {
      window.location.href = "/mediamaraton/panel";
    }
  }

  function exportarCsv() {
    if (!data) return;
    const encabezado = "nombre,telefono,codigo,canjeado,fecha\n";
    const filas = data.registros
      .map((r) =>
        [r.nombre, r.telefono, r.codigo, r.canjeado ? "si" : "no", r.hora]
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([encabezado + filas], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediamaraton-registros-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const registrosFiltrados = useMemo(() => {
    if (!data) return [];
    let lista = data.registros;
    if (soloPendientes) lista = lista.filter((r) => !r.canjeado);
    const q = busqueda.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.telefono.includes(q) ||
        r.codigo.toLowerCase().includes(q)
    );
  }, [data, busqueda, soloPendientes]);

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-vp-white/70">{error ?? "Cargando panel..."}</p>
        {error && (
          <button
            onClick={fetchData}
            className="rounded-full border border-vp-green/50 px-4 py-2 text-sm font-semibold text-vp-green transition hover:bg-vp-green/10"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  const maxHora = Math.max(...data.porHora.map((h) => h.cantidad), 1);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-8">
      <header className="flex items-start justify-between gap-3">
        <div className="flex-1 text-center">
          <h1 className="font-display text-xl font-black tracking-tight text-vp-white uppercase sm:text-2xl">
            Panel Mediamaratón
          </h1>
          <p className="mt-1 text-xs text-vp-white/50">
            {lastUpdated
              ? `Actualizado ${lastUpdated.toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}`
              : ""}
          </p>
        </div>
        <button
          onClick={cerrarSesion}
          disabled={cerrandoSesion}
          className="shrink-0 rounded-full border border-vp-white/20 px-3 py-1.5 text-xs font-semibold text-vp-white/70 transition hover:bg-vp-white/10 disabled:opacity-50"
        >
          {cerrandoSesion ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </header>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-6 py-8 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
          <p className="text-5xl font-black text-vp-white sm:text-6xl">{data.total}</p>
          <p className="mt-2 text-xs font-medium tracking-wide text-vp-green uppercase">
            registros
          </p>
        </div>
        <div className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-6 py-8 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
          <p className="text-5xl font-black text-vp-white sm:text-6xl">{data.canjeados}</p>
          <p className="mt-2 text-xs font-medium tracking-wide text-vp-green uppercase">
            canjeados
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-6 py-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        <h2 className="mb-4 text-sm font-semibold text-vp-white">Registros por hora</h2>
        {data.porHora.length === 0 ? (
          <p className="text-sm text-vp-white/50">Aún no hay registros.</p>
        ) : (
          <HourlyChart data={data.porHora} max={maxHora} />
        )}
      </section>

      <section className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-4 py-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-vp-white">
            Registros ({registrosFiltrados.length})
          </h2>
          <button
            onClick={exportarCsv}
            className="rounded-full border border-vp-green/50 px-3 py-1.5 text-xs font-semibold text-vp-green transition hover:bg-vp-green/10"
          >
            Exportar CSV
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 rounded-xl bg-vp-white px-4 py-2.5 text-sm text-vp-navy placeholder-vp-navy/40 outline-none ring-2 ring-transparent focus:ring-vp-green"
          />
          <button
            onClick={() => setSoloPendientes((v) => !v)}
            className={`shrink-0 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
              soloPendientes
                ? "border-vp-green bg-vp-green text-vp-navy"
                : "border-vp-white/30 text-vp-white/70 hover:bg-vp-white/10"
            }`}
          >
            Solo pendientes
          </button>
        </div>

        {registrosFiltrados.length === 0 ? (
          <p className="text-sm text-vp-white/50">No hay registros que coincidan.</p>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            <ul className="flex flex-col divide-y divide-vp-white/10">
              {registrosFiltrados.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-vp-white">{r.nombre}</p>
                    <p className="text-xs text-vp-white/50">
                      {r.telefono} · {r.hora}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-vp-green">{r.codigo}</span>
                  <button
                    onClick={() => toggleCanjeado(r.id)}
                    disabled={pendientes.has(r.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                      r.canjeado
                        ? "border-vp-green bg-vp-green text-vp-navy"
                        : "border-vp-white/30 text-vp-white/70 hover:bg-vp-white/10"
                    }`}
                  >
                    {r.canjeado ? "Canjeado ✓" : "Marcar canje"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function HourlyChart({
  data,
  max,
}: {
  data: { hora: string; cantidad: number }[];
  max: number;
}) {
  const width = Math.max(data.length * 56, 280);
  const height = 120;
  const padding = 20;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x =
      data.length === 1
        ? width / 2
        : (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = padding + chartHeight - (d.cantidad / max) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="min-w-full">
        <path d={areaPath} fill="#6FAE2D" fillOpacity={0.2} />
        <path
          d={linePath}
          fill="none"
          stroke="#6FAE2D"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="#6FAE2D" />
            <text x={p.x} y={height - 4} textAnchor="middle" fontSize={10} fill="#FFFFFF" opacity={0.6}>
              {p.hora}
            </text>
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={10} fill="#FFFFFF" fontWeight={600}>
              {p.cantidad}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
