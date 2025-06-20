import { Migration } from '@mikro-orm/migrations';

export class Migration20250616080654 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "business" drop constraint if exists "business_slug_unique";`);
    this.addSql(`create table if not exists "business" ("id" text not null, "name" text not null, "slug" text not null, "slogan" text null, "description" text null, "logo_url" text null, "cover_image_url" text null, "theme_config" jsonb not null default '{"colors":{"bg":"#f7f8fa","primary":"#007aff","secondary":"#ffa726","text":"#333333","cardBg":"#ffffff"}}', "contact_info" jsonb not null default '{"phone":null,"email":null,"address":null}', "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "business_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_business_slug_unique" ON "business" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_business_deleted_at" ON "business" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "business" cascade;`);
  }

}
