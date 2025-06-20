import { model } from "@medusajs/framework/utils"

export const Business = model.define("business", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  slogan: model.text().nullable(),
  description: model.text().nullable(),
  logo_url: model.text().nullable(),
  cover_image_url: model.text().nullable(),
  theme_config: model.json().default({
    colors: {
      bg: "#f7f8fa",
      primary: "#007aff",
      secondary: "#ffa726",
      text: "#333333",
      cardBg: "#ffffff"
    }
  }),
  contact_info: model.json().default({
    phone: null,
    email: null,
    address: null
  }),
  is_active: model.boolean().default(true),
})