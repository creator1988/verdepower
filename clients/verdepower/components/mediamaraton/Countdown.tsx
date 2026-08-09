"use client";

import { useEffect, useState } from "react";

const EVENTO_FECHA = new Date("2026-08-16T05:00:00Z"); // 16 de agosto de 2026, 00:00 Bogotá (UTC-5)

type Restante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  terminado: boolean;
};

function calcularRestante(target: Date): Restante {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    dias: Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    minutos: Math.floor((diff % 3600000) / 60000),
    segundos: Math.floor((diff % 60000) / 1000),
    terminado: diff <= 0,
  };
}

export function Countdown() {
  const [restante, setRestante] = useState<Restante | null>(null);

  useEffect(() => {
    setRestante(calcularRestante(EVENTO_FECHA));
    const id = setInterval(() => setRestante(calcularRestante(EVENTO_FECHA)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto mt-2 flex h-[38px] max-w-[280px] items-center justify-center gap-3">
      {restante && !restante.terminado && (
        <>
          <Unidad valor={restante.dias} label="días" />
          <Unidad valor={restante.horas} label="hrs" />
          <Unidad valor={restante.minutos} label="min" />
          <Unidad valor={restante.segundos} label="seg" />
        </>
      )}
    </div>
  );
}

function Unidad({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display min-w-[2.2ch] text-lg leading-none font-black tabular-nums text-vp-green">
        {String(valor).padStart(2, "0")}
      </span>
      <span className="text-[0.55rem] font-semibold tracking-wide text-vp-white/50 uppercase">
        {label}
      </span>
    </div>
  );
}
