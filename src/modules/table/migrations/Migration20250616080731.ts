import { Migration } from '@mikro-orm/migrations';

export class Migration20250616080731 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "table" drop constraint if exists "table_business_id_table_number_unique";`);
    this.addSql(`alter table if exists "table" drop constraint if exists "table_qr_code_unique";`);
    this.addSql(`create table if not exists "table" ("id" text not null, "business_id" text not null, "table_number" text not null, "name" text not null, "qr_code" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "table_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_table_qr_code_unique" ON "table" (qr_code) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_table_deleted_at" ON "table" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_table_business_id_table_number_unique" ON "table" (business_id, table_number) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "table_session" ("id" text not null, "table_id" text not null, "business_id" text not null, "status" text check ("status" in ('active', 'closed')) not null default 'active', "started_at" timestamptz not null, "closed_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "table_session_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_table_session_deleted_at" ON "table_session" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_table_session_table_id" ON "table_session" (table_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_table_session_business_id" ON "table_session" (business_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "table" cascade;`);

    this.addSql(`drop table if exists "table_session" cascade;`);
  }

}
