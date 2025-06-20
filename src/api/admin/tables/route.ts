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
    console.error("Error in GET /admin/tables:", error)
    res.status(500).json({
      error: "Failed to list tables",
      details: error.message,
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const tableService = req.scope.resolve("table") as any
  
  try {
    const { business_id, table_number, name } = req.body as {
      business_id: string
      table_number: string
      name: string
    }
    
    if (!business_id || !table_number || !name) {
      return res.status(400).json({
        error: "Missing required fields: business_id, table_number, name"
      })
    }
    
    const table = await tableService.createOrUpdateTable({
      business_id,
      table_number,
      name,
    })
    
    res.status(201).json({ 
      table,
      message: table.created_at ? "Table created successfully" : "Table already exists, returning existing"
    })
  } catch (error) {
    res.status(400).json({
      error: "Failed to create table",
      details: error.message,
    })
  }
} 