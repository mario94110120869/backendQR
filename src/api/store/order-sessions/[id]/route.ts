import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    const orderSession = await orderSessionService.retrieveOrderSession(id)
    res.json(orderSession)
  } catch (error) {
    res.status(404).json({
      error: "Order session not found",
    })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { action } = req.body as any
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    let updatedSession
    
    switch (action) {
      case "submit":
        updatedSession = await orderSessionService.submitOrder(id)
        break
      default:
        return res.status(400).json({
          error: "Invalid action",
        })
    }
    
    res.json(updatedSession)
  } catch (error) {
    res.status(400).json({
      error: "Failed to update order session",
    })
  }
}