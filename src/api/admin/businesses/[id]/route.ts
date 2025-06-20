import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const businessService = req.scope.resolve("business") as any
  
  try {
    const business = await businessService.retrieveBusiness(id)
    res.json({ business })
  } catch (error) {
    res.status(404).json({
      error: "Business not found",
    })
  }
}

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const businessService = req.scope.resolve("business") as any
  
  try {
    const business = await businessService.updateBusinesses({ id, ...(req.body as any) })
    res.json({ business })
  } catch (error) {
    res.status(400).json({
      error: "Failed to update business",
    })
  }
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const businessService = req.scope.resolve("business") as any
  
  try {
    await businessService.deleteBusinesses(id)
    res.status(204).send()
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete business",
    })
  }
}