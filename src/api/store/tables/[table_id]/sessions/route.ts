import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

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