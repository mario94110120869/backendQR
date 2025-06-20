import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { table_session_id, business_id, customer_name } = req.body as any
  
  const orderSessionService = req.scope.resolve("orderSession") as any
  
  try {
    // Buscar si ya existe un carrito activo para la sesión de mesa
    const activeOrder = await orderSessionService.findActiveOrderForTableSession(table_session_id);
    if (activeOrder) {
      return res.json(activeOrder);
    }
    // Si no existe, crear uno nuevo
    const orderSession = await orderSessionService.createOrderSessionForTable({
      table_session_id,
      business_id,
      customer_name,
    })
    
    res.json(orderSession)
  } catch (error) {
    res.status(400).json({
      error: "Failed to create order session",
    })
  }
}