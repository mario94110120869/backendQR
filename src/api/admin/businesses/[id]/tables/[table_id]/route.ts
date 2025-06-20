import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: business_id, table_id } = req.params
  const tableService = req.scope.resolve("table") as any

  try {
    const table = await tableService.retrieveTableById({
      id: table_id,
      business_id,
    })

    if (!table) {
      return res.status(404).json({ error: "Table not found" })
    }

    res.json({ table })
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve table",
    })
  }
} 