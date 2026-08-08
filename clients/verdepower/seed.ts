import "dotenv/config";
import { db } from "../../core/db/client";
import { clientes } from "../../core/db/schema";

async function main() {
  const [cliente] = await db
    .insert(clientes)
    .values({
      slug: "verdepower",
      nombre: "Verde Power",
    })
    .onConflictDoNothing({ target: clientes.slug })
    .returning();

  if (cliente) {
    console.log("Cliente creado:", cliente);
  } else {
    console.log("El cliente 'verdepower' ya existía, no se hicieron cambios.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
