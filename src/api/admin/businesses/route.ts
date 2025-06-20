import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const businessService = req.scope.resolve("business") as any
  
  try {
    const business = await businessService.createOrUpdateBusiness(req.body)
    res.json({ 
      business,
      message: business.created_at ? "Business created successfully" : "Business already exists, returning existing"
    })
  } catch (error) {
    console.error("Error creating/updating business:", error)
    res.status(400).json({
      error: "Failed to create or update business",
      details: error.message,
    })
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const businessService = req.scope.resolve("business") as any
  
  try {
    const businesses = await businessService.listBusinesses()
    res.json({ businesses })
  } catch (error) {
    res.status(500).json({
      error: "Failed to list businesses",
    })
  }
}