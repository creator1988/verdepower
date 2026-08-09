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

const bogotaTimeFmt = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
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
      nombre: contactos.nombre,
      createdAt: contactos.createdAt,
      metadata: contactos.metadata,
    })
    .from(contactos)
    .where(
      and(
        eq(contactos.clientId, verdepowerConfig.clientId),
        eq(contactos.canalId, mediamaratonConfig.canalId)
      )
    );

  let antes = 0;
  let despues = 0;
  const porHoraMap = new Map<string, number>();

  for (const row of rows) {
    const momento = (row.metadata as { momento_activacion?: string } | null)?.momento_activacion;
    if (momento === "antes") antes++;
    else if (momento === "despues") despues++;

    const key = hourKey(row.createdAt);
    porHoraMap.set(key, (porHoraMap.get(key) ?? 0) + 1);
  }

  const porHora = [...porHoraMap.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, cantidad]) => ({ hora: key.slice(-5), cantidad }));

  const ultimos = [...rows]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map((r) => ({ nombre: r.nombre, hora: bogotaTimeFmt.format(r.createdAt) }));

  return NextResponse.json({
    total: rows.length,
    antes,
    despues,
    porHora,
    ultimos,
  });
}
