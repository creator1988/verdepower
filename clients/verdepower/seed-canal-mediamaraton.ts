import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { db } from "../../core/db/client";
import { canales, clientes } from "../../core/db/schema";

const NOMBRE_CANAL = "Media Maratón Ciudad Bonita 2026";

async function main() {
  const [verdepower] = await db
    .select()
    .from(clientes)
    .where(eq(clientes.slug, "verdepower"));

  if (!verdepower) {
    throw new Error("No existe el cliente 'verdepower'. Corre primero el seed de clientes.");
  }

  const [existente] = await db
    .select()
    .from(canales)
    .where(and(eq(canales.clientId, verdepower.id), eq(canales.nombre, NOMBRE_CANAL)));

  if (existente) {
    console.log("El canal ya existía, no se hicieron cambios:", existente);
    return;
  }

  const [canal] = await db
    .insert(canales)
    .values({
      clientId: verdepower.id,
      tipo: "evento",
      nombre: NOMBRE_CANAL,
      estado: "activo",
      ubicacion: "Bucaramanga",
      fechaInicio: "2026-08-16",
      fechaFin: "2026-08-16",
      metadata: {
        fecha: "2026-08-16",
        ciudad: "Bucaramanga",
      },
    })
    .returning();

  console.log("Canal creado:", canal);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
