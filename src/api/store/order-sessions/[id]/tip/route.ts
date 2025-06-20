import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { tip_amount } = req.body as any
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    const updatedSession = await orderSessionService.addTip(id, tip_amount)
    res.json(updatedSession)
  } catch (error) {
    res.status(400).json({
      error: "Failed to add tip",
    })
  }
}