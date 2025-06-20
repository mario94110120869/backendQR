import { Migration } from '@mikro-orm/migrations';

export class Migration20250616080723 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "order_session" ("id" text not null, "table_session_id" text not null, "business_id" text not null, "customer_name" text null, "status" text check ("status" in ('active', 'submitted', 'preparing', 'ready', 'delivered', 'paid', 'cancelled')) not null default 'active', "items" jsonb not null default '{}', "subtotal" numeric not null default 0, "tax_amount" numeric not null default 0, "tip_amount" numeric not null default 0, "total_amount" numeric not null default 0, "notes" text null, "submitted_at" timestamptz null, "paid_at" timestamptz null, "raw_subtotal" jsonb not null, "raw_tax_amount" jsonb not null, "raw_tip_amount" jsonb not null, "raw_total_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "order_session_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_session_deleted_at" ON "order_session" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_session_table_session_id" ON "order_session" (table_session_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_session_business_id" ON "order_session" (business_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_session_status" ON "order_session" (status) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "order_session" cascade;`);
  }

}
