import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const tableService = req.scope.resolve("table") as any
    const tables = await tableService.listTables()
    
    res.json({ tables })
  } catch (error) {
    console.error("Error in GET /store/tables:", error)
    res.status(500).json({
      error: "Failed to list tables",
      details: error.message,
    })
  }
} 