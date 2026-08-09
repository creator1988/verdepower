"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { ProductBlock } from "./ProductBlock";
import { CaptureForm } from "./CaptureForm";
import { WhatsAppCTA } from "./WhatsAppCTA";

export function MediamaratonLanding() {
  const [enviado, setEnviado] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-vp-forest-dark">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="vp-parallax-1 absolute -top-24 -right-20 h-72 w-72 rounded-full bg-vp-moss opacity-25 blur-3xl sm:h-96 sm:w-96" />
        <div className="vp-parallax-2 absolute top-[55%] -left-28 h-80 w-80 rounded-full bg-vp-forest opacity-30 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
        <div className="vp-parallax-3 absolute bottom-10 -right-16 h-64 w-64 rounded-full bg-vp-moss opacity-20 blur-3xl" />
        <div className="vp-noise absolute inset-0" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <Hero />
        <ProductBlock />
        {enviado ? <WhatsAppCTA /> : <CaptureForm onSuccess={() => setEnviado(true)} />}
        <div className="h-16" />
      </div>
    </main>
  );
}
