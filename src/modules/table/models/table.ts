import { model } from "@medusajs/framework/utils"

export const Table = model.define("table", {
  id: model.id().primaryKey(),
  business_id: model.text(),
  table_number: model.text(),
  name: model.text(),
  qr_code: model.text().unique(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
}).indexes([
  {
    on: ["business_id", "table_number"],
    unique: true,
  },
])