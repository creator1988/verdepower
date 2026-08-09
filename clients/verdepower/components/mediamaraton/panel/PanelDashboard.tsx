"use client";

import { useCallback, useEffect, useState } from "react";

type PanelData = {
  total: number;
  porHora: { hora: string; cantidad: number }[];
  ultimos: { nombre: string; codigo: string; hora: string }[];
};

const POLL_INTERVAL_MS = 18000;

export function PanelDashboard() {
  const [data, setData] = useState<PanelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/panel-data", { cache: "no-store" });

      if (res.status === 401) {
        window.location.href = "/mediamaraton/panel";
        return;
      }
      if (!res.ok) throw new Error("request-failed");

      const json: PanelData = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("No pudimos actualizar los datos. Reintentando...");
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-vp-white/70">Cargando panel...</p>
      </div>
    );
  }

  const maxHora = Math.max(...data.porHora.map((h) => h.cantidad), 1);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <header className="text-center">
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
      </header>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <section className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-6 py-8 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        <p className="text-6xl font-black text-vp-white sm:text-7xl">{data.total}</p>
        <p className="mt-2 text-sm font-medium tracking-wide text-vp-green uppercase">
          registros capturados
        </p>
      </section>

      <section className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-6 py-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        <h2 className="mb-4 text-sm font-semibold text-vp-white">Registros por hora</h2>
        {data.porHora.length === 0 ? (
          <p className="text-sm text-vp-white/50">Aún no hay registros.</p>
        ) : (
          <HourlyChart data={data.porHora} max={maxHora} />
        )}
      </section>

      <section className="rounded-3xl border border-vp-white/10 bg-vp-blue/30 px-6 py-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
        <h2 className="mb-4 text-sm font-semibold text-vp-white">Últimos registros</h2>
        {data.ultimos.length === 0 ? (
          <p className="text-sm text-vp-white/50">Aún no hay registros.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-vp-white/10">
            {data.ultimos.map((u, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium text-vp-white">{u.nombre}</span>
                <span className="font-mono text-vp-green">{u.codigo}</span>
                <span className="text-vp-white/50">{u.hora}</span>
              </li>
            ))}
          </ul>
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
