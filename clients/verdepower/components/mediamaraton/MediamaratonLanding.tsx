"use client";

import { useState, type SVGProps } from "react";
import { Hero } from "./Hero";
import { ProductBlock } from "./ProductBlock";
import { RegistroForm } from "./RegistroForm";
import { CodigoActivacion } from "./CodigoActivacion";

type Registro = { codigo: string; nombre: string };

function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function MediamaratonLanding() {
  const [registro, setRegistro] = useState<Registro | null>(null);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-vp-navy">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-vp-blue opacity-40 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-vp-green opacity-15 blur-3xl" />
        <div className="vp-noise absolute inset-0" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-3">
        <Hero />
        <ProductBlock />
        {registro ? (
          <CodigoActivacion nombre={registro.nombre} codigo={registro.codigo} />
        ) : (
          <RegistroForm onSuccess={(codigo, nombre) => setRegistro({ codigo, nombre })} />
        )}

        <p className="mx-auto flex items-center justify-center gap-1.5 pb-3 text-xs text-vp-white/70">
          <IconLock className="h-3.5 w-3.5" />
          Tus datos están seguros · Hecho en Colombia
        </p>
      </div>
    </main>
  );
}
