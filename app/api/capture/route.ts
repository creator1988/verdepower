import { NextRequest, NextResponse } from "next/server";
import { db } from "@/core/db/client";
import { contactos } from "@/core/db/schema";
import { verdepowerConfig, mediamaratonConfig } from "@/clients/verdepower/config";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  const whatsapp = typeof body?.whatsapp === "string" ? body.whatsapp.trim() : "";
  const momentoActivacion = body?.momentoActivacion;

  if (nombre.length < 2 || whatsapp.length < 7) {
    return NextResponse.json({ error: "datos inválidos" }, { status: 400 });
  }

  if (momentoActivacion !== "antes" && momentoActivacion !== "despues") {
    return NextResponse.json({ error: "momento_activacion inválido" }, { status: 400 });
  }

  if (!verdepowerConfig.clientId || !mediamaratonConfig.canalId) {
    return NextResponse.json({ error: "canal no configurado" }, { status: 500 });
  }

  await db
    .insert(contactos)
    .values({
      clientId: verdepowerConfig.clientId,
      canalId: mediamaratonConfig.canalId,
      nombre,
      telefono: whatsapp,
      estadoPipeline: "identificado",
      metadata: { momento_activacion: momentoActivacion },
    })
    .onConflictDoUpdate({
      target: [contactos.clientId, contactos.telefono],
      set: {
        canalId: mediamaratonConfig.canalId,
        nombre,
        metadata: { momento_activacion: momentoActivacion },
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
