import { Modules } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"
import {
  createProductsWorkflow,
  CreateProductsWorkflowInput,
} from "@medusajs/medusa/core-flows"

export default async function seedMenuQR({ container }: any) {
  const productService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )
  const businessService = container.resolve("business") as any
  const tableService = container.resolve("table") as any
  
  console.log("Starting MenuQR seed...")
  
  // Create a test business
  const business = await businessService.createBusinesses({
    name: "Bar Plaza",
    slug: "bar-plaza",
    slogan: "Tu lugar favorito 🍻",
    description: "El mejor bar de la ciudad con las mejores tapas",
    logo_url: "https://placehold.co/200x200/007aff/ffffff?text=Bar+Plaza",
    cover_image_url: "https://placehold.co/800x400/007aff/ffffff?text=Bar+Plaza",
    theme_config: {
      colors: {
        bg: "#f7f8fa",
        primary: "#007aff",
        secondary: "#ffa726",
        text: "#333333",
        cardBg: "#ffffff"
      }
    },
    contact_info: {
      phone: "+34 666 777 888",
      email: "info@barplaza.com",
      address: "Plaza Mayor 1, Madrid"
    }
  })
  
  console.log("Created business:", business.name)
  
  // Create tables for the business
  const tables: any[] = []
  for (let i = 1; i <= 10; i++) {
    const table = await tableService.createTableWithQR({
      business_id: business.id,
      table_number: i.toString(),
      name: `Mesa ${i}`
    })
    tables.push(table)
  }
  
  console.log(`Created ${tables.length} tables`)
  
  // Create products
  const products: CreateProductsWorkflowInput["products"] = [
    {
      title: "Cerveza Artesanal IPA",
      description: "33cl de nuestra IPA de la casa",
      handle: "cerveza-ipa",
      thumbnail: "https://placehold.co/400x400/ffa726/ffffff?text=IPA",
      options: [{ title: "Tamaño", values: ["33cl", "50cl"] }],
      variants: [
        {
          title: "33cl",
          sku: "BEER-IPA-33",
          prices: [
            {
              amount: 450,
              currency_code: "EUR",
            },
          ],
          options: { Tamaño: "33cl" },
        },
        {
          title: "50cl",
          sku: "BEER-IPA-50",
          prices: [
            {
              amount: 650,
              currency_code: "EUR",
            },
          ],
          options: { Tamaño: "50cl" },
        },
      ],
    },
    {
      title: "Tapa de Jamón",
      description: "Jamón ibérico con pan con tomate",
      handle: "tapa-jamon",
      thumbnail: "https://placehold.co/400x400/ff5252/ffffff?text=Jamon",
      variants: [
        {
          title: "Ración",
          sku: "TAPA-JAMON",
          prices: [
            {
              amount: 1200,
              currency_code: "EUR",
            },
          ],
        },
      ],
    },
    {
      title: "Patatas Bravas",
      description: "Patatas fritas con salsa brava casera",
      handle: "patatas-bravas",
      thumbnail: "https://placehold.co/400x400/ffa726/ffffff?text=Bravas",
      variants: [
        {
          title: "Ración",
          sku: "TAPA-BRAVAS",
          prices: [
            {
              amount: 800,
              currency_code: "EUR",
            },
          ],
        },
      ],
    },
    {
      title: "Croquetas Caseras",
      description: "6 unidades de croquetas de jamón",
      handle: "croquetas",
      thumbnail: "https://placehold.co/400x400/4caf50/ffffff?text=Croquetas",
      variants: [
        {
          title: "6 unidades",
          sku: "TAPA-CROQUETAS",
          prices: [
            {
              amount: 900,
              currency_code: "EUR",
            },
          ],
        },
      ],
    },
    {
      title: "Tortilla Española",
      description: "Porción de tortilla de patatas",
      handle: "tortilla",
      thumbnail: "https://placehold.co/400x400/ffeb3b/333333?text=Tortilla",
      variants: [
        {
          title: "Porción",
          sku: "TAPA-TORTILLA",
          prices: [
            {
              amount: 700,
              currency_code: "EUR",
            },
          ],
        },
      ],
    },
    {
      title: "Café Solo",
      description: "Café expreso",
      handle: "cafe-solo",
      thumbnail: "https://placehold.co/400x400/795548/ffffff?text=Cafe",
      variants: [
        {
          title: "Solo",
          sku: "DRINK-CAFE-SOLO",
          prices: [
            {
              amount: 150,
              currency_code: "EUR",
            },
          ],
        },
      ],
    },
    {
      title: "Refresco",
      description: "Coca-Cola, Fanta, Sprite",
      handle: "refresco",
      thumbnail: "https://placehold.co/400x400/f44336/ffffff?text=Refresco",
      options: [{ title: "Tipo", values: ["Coca-Cola", "Fanta", "Sprite"] }],
      variants: [
        {
          title: "Coca-Cola",
          sku: "DRINK-COLA",
          prices: [
            {
              amount: 300,
              currency_code: "EUR",
            },
          ],
          options: { Tipo: "Coca-Cola" },
        },
        {
          title: "Fanta",
          sku: "DRINK-FANTA",
          prices: [
            {
              amount: 300,
              currency_code: "EUR",
            },
          ],
          options: { Tipo: "Fanta" },
        },
        {
          title: "Sprite",
          sku: "DRINK-SPRITE",
          prices: [
            {
              amount: 300,
              currency_code: "EUR",
            },
          ],
          options: { Tipo: "Sprite" },
        },
      ],
    },
  ]
  
  for (const productData of products) {
    await createProductsWorkflow.run({
      input: {
        products: [productData],
      },
    })
  }
  
  console.log(`Created ${products.length} products`)
  
  console.log("\nMenuQR seed completed!")
  console.log(`Business: ${business.name} (ID: ${business.id})`)
  console.log(`Tables: ${tables.length} tables created`)
  console.log(`Products: ${products.length} products created`)
  console.log("\nQR codes for tables:")
  tables.slice(0, 3).forEach(table => {
    console.log(`- Mesa ${table.table_number}: QR Code: ${table.qr_code}`)
  })
}