import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: business_id } = req.params
  const tableService = req.scope.resolve("table") as any
  
  try {
    const table = await tableService.createTableWithQR({
      business_id,
      ...(req.body as any),
    })
    
    res.json({ table })
  } catch (error) {
    res.status(400).json({
      error: "Failed to create table",
    })
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: business_id } = req.params
  const tableService = req.scope.resolve("table") as any
  
  try {
    const tables = await tableService.listTables({
      business_id,
    })
    
    res.json({ tables })
  } catch (error) {
    res.status(500).json({
      error: "Failed to list tables",
    })
  }
}