import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/core/db/client";
import { contactos } from "@/core/db/schema";
import { verdepowerConfig, mediamaratonConfig } from "@/clients/verdepower/config";
import { PANEL_COOKIE_NAME, isValidPanelToken } from "@/core/auth/panel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bogotaHourFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Bogota",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
});

const bogotaDateTimeFmt = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function hourKey(d: Date) {
  const parts = Object.fromEntries(bogotaHourFmt.formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:00`;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(PANEL_COOKIE_NAME)?.value;
  if (!isValidPanelToken(token)) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  if (!verdepowerConfig.clientId || !mediamaratonConfig.canalId) {
    return NextResponse.json({ error: "canal no configurado" }, { status: 500 });
  }

  const rows = await db
    .select({
      id: contactos.id,
      nombre: contactos.nombre,
      telefono: contactos.telefono,
      codigo: contactos.codigo,
      canjeadoEn: contactos.canjeadoEn,
      createdAt: contactos.createdAt,
    })
    .from(contactos)
    .where(
      and(
        eq(contactos.clientId, verdepowerConfig.clientId),
        eq(contactos.canalId, mediamaratonConfig.canalId)
      )
    );

  const porHoraMap = new Map<string, number>();
  let canjeados = 0;
  for (const row of rows) {
    const key = hourKey(row.createdAt);
    porHoraMap.set(key, (porHoraMap.get(key) ?? 0) + 1);
    if (row.canjeadoEn) canjeados++;
  }

  const porHora = [...porHoraMap.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, cantidad]) => ({ hora: key.slice(-5), cantidad }));

  const registros = [...rows]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((r) => ({
      id: r.id,
      nombre: r.nombre,
      telefono: r.telefono,
      codigo: r.codigo ?? "—",
      canjeado: Boolean(r.canjeadoEn),
      hora: bogotaDateTimeFmt.format(r.createdAt),
    }));

  return NextResponse.json({
    total: rows.length,
    canjeados,
    porHora,
    registros,
  });
}
