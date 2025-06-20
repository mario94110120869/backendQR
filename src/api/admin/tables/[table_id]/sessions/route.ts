import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { table_id } = req.params
  const tableService = req.scope.resolve("table") as any
  
  try {
    // Obtener la mesa para verificar que existe y obtener el business_id
    const table = await tableService.retrieveTable(table_id)
    
    if (!table) {
      return res.status(404).json({
        error: "Table not found"
      })
    }

    // Iniciar la sesión
    const session = await tableService.startTableSession(table_id, table.business_id)
    
    res.status(201).json({ 
      session,
      message: "Table session started successfully"
    })
  } catch (error) {
    console.error("Error starting table session:", error)
    res.status(400).json({
      error: "Failed to start table session"
    })
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { table_id } = req.params
  const tableService = req.scope.resolve("table") as any
  
  try {
    const sessions = await tableService.listTableSessions({
      table_id,
    })
    
    res.json({ sessions })
  } catch (error) {
    console.error("Error listing table sessions:", error)
    res.status(500).json({
      error: "Failed to list table sessions"
    })
  }
} 