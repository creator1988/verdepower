CREATE TYPE "public"."canal_estado" AS ENUM('activo', 'pausado', 'finalizado');--> statement-breakpoint
CREATE TYPE "public"."canal_tipo" AS ENUM('evento', 'gimnasio', 'escuela_deportiva', 'corporativo');--> statement-breakpoint
CREATE TYPE "public"."pipeline_estado" AS ENUM('identificado', 'contactado', 'oferta', 'seguimiento', 'cierre', 'recompra');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "canales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"tipo" "canal_tipo" NOT NULL,
	"nombre" text NOT NULL,
	"estado" "canal_estado" DEFAULT 'activo' NOT NULL,
	"responsable" text,
	"ubicacion" text,
	"fecha_inicio" date,
	"fecha_fin" date,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clientes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contactos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"telefono" text NOT NULL,
	"email" text,
	"canal_id" uuid NOT NULL,
	"segmento" text,
	"estado_pipeline" "pipeline_estado" DEFAULT 'identificado' NOT NULL,
	"notas" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pipeline_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"contacto_id" uuid NOT NULL,
	"canal_id" uuid NOT NULL,
	"estado_anterior" "pipeline_estado",
	"estado_nuevo" "pipeline_estado" NOT NULL,
	"ocurrido_en" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "canales" ADD CONSTRAINT "canales_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contactos" ADD CONSTRAINT "contactos_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contactos" ADD CONSTRAINT "contactos_canal_id_canales_id_fk" FOREIGN KEY ("canal_id") REFERENCES "public"."canales"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pipeline_history" ADD CONSTRAINT "pipeline_history_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pipeline_history" ADD CONSTRAINT "pipeline_history_contacto_id_contactos_id_fk" FOREIGN KEY ("contacto_id") REFERENCES "public"."contactos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pipeline_history" ADD CONSTRAINT "pipeline_history_canal_id_canales_id_fk" FOREIGN KEY ("canal_id") REFERENCES "public"."canales"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_canales_client_id" ON "canales" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_canales_tipo" ON "canales" USING btree ("client_id","tipo");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contactos_client_id" ON "contactos" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contactos_canal_id" ON "contactos" USING btree ("canal_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contactos_estado_pipeline" ON "contactos" USING btree ("client_id","estado_pipeline");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_contactos_telefono_unico" ON "contactos" USING btree ("client_id","telefono");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pipeline_history_client_id" ON "pipeline_history" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pipeline_history_contacto_id" ON "pipeline_history" USING btree ("contacto_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pipeline_history_canal_id" ON "pipeline_history" USING btree ("client_id","canal_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pipeline_history_ocurrido_en" ON "pipeline_history" USING btree ("client_id","ocurrido_en");