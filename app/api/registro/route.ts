import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/core/db/client";
import { contactos } from "@/core/db/schema";
import { verdepowerConfig, mediamaratonConfig } from "@/clients/verdepower/config";
import { generarCodigo } from "@/clients/verdepower/codigo";
import { normalizarWhatsapp } from "@/clients/verdepower/whatsapp";

export const runtime = "nodejs";

async function generarCodigoUnico(): Promise<string> {
  for (let intento = 0; intento < 6; intento++) {
    const candidato = generarCodigo();
    const existente = await db
      .select({ id: contactos.id })
      .from(contactos)
      .where(eq(contactos.codigo, candidato))
      .limit(1);
    if (existente.length === 0) return candidato;
  }
  throw new Error("no se pudo generar un código único");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  const telefono = normalizarWhatsapp(typeof body?.whatsapp === "string" ? body.whatsapp : "");

  if (nombre.length < 2) {
    return NextResponse.json({ error: "el nombre debe tener al menos 2 caracteres" }, { status: 400 });
  }
  if (!telefono) {
    return NextResponse.json({ error: "el WhatsApp debe tener 10 dígitos" }, { status: 400 });
  }
  if (!verdepowerConfig.clientId || !mediamaratonConfig.canalId) {
    return NextResponse.json({ error: "canal no configurado" }, { status: 500 });
  }

  const buscarExistente = () =>
    db
      .select({ codigo: contactos.codigo })
      .from(contactos)
      .where(
        and(eq(contactos.clientId, verdepowerConfig.clientId), eq(contactos.telefono, telefono))
      )
      .limit(1);

  try {
    const existente = await buscarExistente();

    if (existente.length > 0 && existente[0].codigo) {
      return NextResponse.json({ codigo: existente[0].codigo });
    }

    const codigo = await generarCodigoUnico();

    if (existente.length > 0) {
      await db
        .update(contactos)
        .set({ codigo, nombre, updatedAt: new Date() })
        .where(
          and(eq(contactos.clientId, verdepowerConfig.clientId), eq(contactos.telefono, telefono))
        );
    } else {
      await db.insert(contactos).values({
        clientId: verdepowerConfig.clientId,
        canalId: mediamaratonConfig.canalId,
        nombre,
        telefono,
        codigo,
        metadata: {},
      });
    }

    return NextResponse.json({ codigo });
  } catch {
    // Probable condición de carrera: dos solicitudes simultáneas con el mismo
    // teléfono. Reintentamos leyendo el registro que ya debió quedar guardado.
    try {
      const existente = await buscarExistente();
      if (existente.length > 0 && existente[0].codigo) {
        return NextResponse.json({ codigo: existente[0].codigo });
      }
    } catch {
      // se reporta el error original abajo
    }
    return NextResponse.json({ error: "no pudimos guardar tu registro" }, { status: 500 });
  }
}
