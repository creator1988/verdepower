"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { ProductBlock } from "./ProductBlock";
import { CaptureForm } from "./CaptureForm";
import { WhatsAppCTA } from "./WhatsAppCTA";

export function MediamaratonLanding() {
  const [enviado, setEnviado] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-vp-forest-dark">
      <Hero />
      <ProductBlock />
      {enviado ? <WhatsAppCTA /> : <CaptureForm onSuccess={() => setEnviado(true)} />}
      <div className="h-16" />
    </main>
  );
}
