import { model } from "@medusajs/framework/utils"

export const OrderSession = model.define("order_session", {
  id: model.id().primaryKey(),
  table_session_id: model.text(),
  business_id: model.text(),
  customer_name: model.text().nullable(),
  status: model.enum([
    "active",
    "submitted",
    "preparing",
    "ready",
    "delivered",
    "paid",
    "cancelled"
  ]).default("active"),
  items: model.json().default({}),
  subtotal: model.bigNumber().default(0),
  tax_amount: model.bigNumber().default(0),
  tip_amount: model.bigNumber().default(0),
  total_amount: model.bigNumber().default(0),
  notes: model.text().nullable(),
  submitted_at: model.dateTime().nullable(),
  paid_at: model.dateTime().nullable(),
}).indexes([
  {
    on: ["table_session_id"],
  },
  {
    on: ["business_id"],
  },
  {
    on: ["status"],
  },
])