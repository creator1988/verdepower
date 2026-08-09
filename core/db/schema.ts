import {
  pgTable,
  pgEnum,
  uuid,
  text,
  date,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ── ENUMS ────────────────────────────────────────────────────────────

export const canalTipoEnum = pgEnum("canal_tipo", [
  "evento",
  "gimnasio",
  "escuela_deportiva",
  "corporativo",
]);

export const canalEstadoEnum = pgEnum("canal_estado", [
  "activo",
  "pausado",
  "finalizado",
]);

export const pipelineEstadoEnum = pgEnum("pipeline_estado", [
  "identificado",
  "contactado",
  "oferta",
  "seguimiento",
  "cierre",
  "recompra",
]);

// ── CLIENTES ─────────────────────────────────────────────────────────
// Tabla mínima multi-tenant: sin auth ni billing todavía.

export const clientes = pgTable("clientes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── CANALES ──────────────────────────────────────────────────────────
// Instancias concretas de canal: un gimnasio, un evento, un convenio corporativo.

export const canales = pgTable(
  "canales",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clientes.id),

    tipo: canalTipoEnum("tipo").notNull(),
    nombre: text("nombre").notNull(),
    estado: canalEstadoEnum("estado").notNull().default("activo"),

    responsable: text("responsable"),
    ubicacion: text("ubicacion"),

    fechaInicio: date("fecha_inicio"),
    fechaFin: date("fecha_fin"),

    metadata: jsonb("metadata").notNull().default({}),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_canales_client_id").on(table.clientId),
    index("idx_canales_tipo").on(table.clientId, table.tipo),
  ]
);

// ── CONTACTOS ────────────────────────────────────────────────────────
// Persona capturada por un canal. estado_pipeline guarda el estado actual;
// el historial completo de transiciones vive en pipeline_history.

export const contactos = pgTable(
  "contactos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clientes.id),

    nombre: text("nombre").notNull(),
    telefono: text("telefono").notNull(),
    email: text("email"),
    codigo: text("codigo"),

    canalId: uuid("canal_id")
      .notNull()
      .references(() => canales.id),
    segmento: text("segmento"),

    estadoPipeline: pipelineEstadoEnum("estado_pipeline").notNull().default("identificado"),

    notas: text("notas"),
    metadata: jsonb("metadata").notNull().default({}),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_contactos_client_id").on(table.clientId),
    index("idx_contactos_canal_id").on(table.canalId),
    index("idx_contactos_estado_pipeline").on(table.clientId, table.estadoPipeline),
    uniqueIndex("idx_contactos_telefono_unico").on(table.clientId, table.telefono),
    uniqueIndex("idx_contactos_codigo_unico").on(table.codigo),
  ]
);

// ── PIPELINE_HISTORY ─────────────────────────────────────────────────
// Log append-only de cada transición de estado. canal_id va desnormalizado
// para que el agente analítico pueda medir conversión por canal en el
// tiempo sin hacer join contra contactos en cada consulta.

export const pipelineHistory = pgTable(
  "pipeline_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clientes.id),

    contactoId: uuid("contacto_id")
      .notNull()
      .references(() => contactos.id),
    canalId: uuid("canal_id")
      .notNull()
      .references(() => canales.id),

    estadoAnterior: pipelineEstadoEnum("estado_anterior"),
    estadoNuevo: pipelineEstadoEnum("estado_nuevo").notNull(),

    ocurridoEn: timestamp("ocurrido_en", { withTimezone: true }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default({}),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_pipeline_history_client_id").on(table.clientId),
    index("idx_pipeline_history_contacto_id").on(table.contactoId),
    index("idx_pipeline_history_canal_id").on(table.clientId, table.canalId),
    index("idx_pipeline_history_ocurrido_en").on(table.clientId, table.ocurridoEn),
  ]
);
