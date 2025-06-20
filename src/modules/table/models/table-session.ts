import { model } from "@medusajs/framework/utils"

export const TableSession = model.define("table_session", {
  id: model.id().primaryKey(),
  table_id: model.text(),
  business_id: model.text(),
  status: model.enum(["active", "closed"]).default("active"),
  started_at: model.dateTime(),
  ended_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
}).indexes([
  {
    on: ["table_id"],
  },
  {
    on: ["business_id"],
  },
])