import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const item = req.body
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    const updatedSession = await orderSessionService.addItemToOrder(id, item)
    res.json(updatedSession)
  } catch (error) {
    res.status(400).json({
      error: "Failed to add item to order",
    })
  }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { variant_id } = req.body as any
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    const updatedSession = await orderSessionService.removeItemFromOrder(id, variant_id)
    res.json(updatedSession)
  } catch (error) {
    res.status(400).json({
      error: "Failed to remove item from order",
    })
  }
}

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const { variant_id, quantity } = req.body as any
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    const updatedSession = await orderSessionService.updateItemQuantity(
      id,
      variant_id,
      quantity
    )
    res.json(updatedSession)
  } catch (error) {
    res.status(400).json({
      error: "Failed to update item quantity",
    })
  }
}