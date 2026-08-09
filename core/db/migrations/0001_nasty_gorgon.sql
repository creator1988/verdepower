ALTER TABLE "contactos" ADD COLUMN "codigo" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contactos_codigo_unico" ON "contactos" USING btree ("codigo");