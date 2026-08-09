"use client";

import { useCallback, useEffect, useState } from "react";

type PanelData = {
  total: number;
  antes: number;
  despues: number;
  porHora: { hora: string; cantidad: number }[];
  ultimos: { nombre: string; hora: string }[];
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
        <p className="text-vp-cream/70">Cargando panel...</p>
      </div>
    );
  }

  const maxMomento = Math.max(data.antes, data.despues, 1);
  const maxHora = Math.max(...data.porHora.map((h) => h.cantidad), 1);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <header className="text-center">
        <h1 className="font-serif text-xl font-semibold text-vp-cream sm:text-2xl">
          Panel Mediamaratón
        </h1>
        <p className="mt-1 text-xs text-vp-cream/50">
          {lastUpdated
            ? `Actualizado ${lastUpdated.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}`
            : ""}
        </p>
      </header>

      {error && <p className="text-center text-sm text-red-300">{error}</p>}

      <section className="rounded-3xl bg-[radial-gradient(ellipse_at_top,_#2C5F2D_0%,_#1E4220_65%)] px-6 py-8 text-center shadow-[0_30px_60px_-20px_rgba(30,66,32,0.45)]">
        <p className="text-6xl font-bold text-vp-cream sm:text-7xl">{data.total}</p>
        <p className="mt-2 text-sm font-medium tracking-wide text-vp-moss">
          contactos capturados
        </p>
      </section>

      <section className="rounded-3xl bg-[radial-gradient(circle_at_center,_#E7F0DC_0%,_#FBFBF8_75%)] px-6 py-6 shadow-[0_30px_60px_-20px_rgba(30,66,32,0.45)]">
        <h2 className="mb-4 text-sm font-semibold text-vp-ink">Antes vs. después de correr</h2>
        <div className="flex flex-col gap-3">
          <BarRow label="Antes de correr" value={data.antes} max={maxMomento} />
          <BarRow label="Después de correr" value={data.despues} max={maxMomento} />
        </div>
      </section>

      <section className="rounded-3xl bg-[radial-gradient(circle_at_center,_#E7F0DC_0%,_#FBFBF8_75%)] px-6 py-6 shadow-[0_30px_60px_-20px_rgba(30,66,32,0.45)]">
        <h2 className="mb-4 text-sm font-semibold text-vp-ink">Registros por hora</h2>
        {data.porHora.length === 0 ? (
          <p className="text-sm text-vp-ink/50">Aún no hay registros.</p>
        ) : (
          <HourlyChart data={data.porHora} max={maxHora} />
        )}
      </section>

      <section className="rounded-3xl bg-[radial-gradient(circle_at_center,_#E7F0DC_0%,_#FBFBF8_75%)] px-6 py-6 shadow-[0_30px_60px_-20px_rgba(30,66,32,0.45)]">
        <h2 className="mb-4 text-sm font-semibold text-vp-ink">Últimos registros</h2>
        {data.ultimos.length === 0 ? (
          <p className="text-sm text-vp-ink/50">Aún no hay registros.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-vp-forest/10">
            {data.ultimos.map((u, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium text-vp-ink">{u.nombre}</span>
                <span className="text-vp-ink/50">{u.hora}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-vp-ink/70">
        <span>{label}</span>
        <span className="font-semibold text-vp-ink">{value}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-vp-forest/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#97BC62] to-[#2C5F2D] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
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
        <path d={areaPath} fill="#97BC62" fillOpacity={0.15} />
        <path
          d={linePath}
          fill="none"
          stroke="#2C5F2D"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="#2C5F2D" />
            <text x={p.x} y={height - 4} textAnchor="middle" fontSize={10} fill="#233022" opacity={0.6}>
              {p.hora}
            </text>
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={10} fill="#233022" fontWeight={600}>
              {p.cantidad}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
