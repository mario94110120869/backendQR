import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  
  const businessService = req.scope.resolve("business") as any
  
  try {
    const config = await businessService.getBusinessConfig(id)
    
    res.json(config)
  } catch (error) {
    res.status(404).json({
      error: "Business not found",
    })
  }
}