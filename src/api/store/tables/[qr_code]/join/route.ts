import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { qr_code } = req.params
  
  const tableService = req.scope.resolve("table") as any
  
  try {
    // Get table by QR code
    const table = await tableService.retrieveByQRCode(qr_code)
    
    // Always create a new session
    const session = await tableService.forceStartTableSession(table.id, table.business_id)
    
    res.json({
      session_id: session.id,
      table_id: table.id,
      table_number: table.table_number,
      table_name: table.name,
      business_id: table.business_id,
    })
  } catch (error) {
    res.status(404).json({
      error: "Invalid QR code",
    })
  }
}