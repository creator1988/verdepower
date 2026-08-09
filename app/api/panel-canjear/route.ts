import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/core/db/client";
import { contactos } from "@/core/db/schema";
import { PANEL_COOKIE_NAME, isValidPanelToken } from "@/core/auth/panel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(PANEL_COOKIE_NAME)?.value;
  if (!isValidPanelToken(token)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "id inválido" }, { status: 400 });
  }

  const [actual] = await db
    .select({ canjeadoEn: contactos.canjeadoEn })
    .from(contactos)
    .where(eq(contactos.id, id))
    .limit(1);

  if (!actual) {
    return NextResponse.json({ error: "registro no encontrado" }, { status: 404 });
  }

  const nuevoValor = actual.canjeadoEn ? null : new Date();

  await db.update(contactos).set({ canjeadoEn: nuevoValor }).where(eq(contactos.id, id));

  return NextResponse.json({ canjeadoEn: nuevoValor ? nuevoValor.toISOString() : null });
}
