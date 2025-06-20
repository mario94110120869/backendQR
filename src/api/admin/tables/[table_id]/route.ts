import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { table_id } = req.params
  const tableService = req.scope.resolve("table") as any

  try {
    const [table] = await tableService.listTables({
      id: table_id,
    })

    if (!table) {
      return res.status(404).json({ error: "Table not found" })
    }

    res.json({ table })
  } catch (error) {
    console.error("Error retrieving table:", error)
    
    if (error.message && error.message.includes("not found")) {
      return res.status(404).json({ error: "Table not found" })
    }
    
    res.status(500).json({
      error: "Failed to retrieve table",
      details: error.message,
    })
  }
} 