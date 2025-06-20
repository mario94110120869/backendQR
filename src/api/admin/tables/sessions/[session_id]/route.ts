import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { session_id } = req.params
  const tableService = req.scope.resolve("table") as any
  
  try {
    const session = await tableService.closeTableSession(session_id)
    
    res.json({ 
      session,
      message: "Table session closed successfully"
    })
  } catch (error) {
    console.error("Error closing table session:", error)
    res.status(400).json({
      error: "Failed to close table session"
    })
  }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { session_id } = req.params
  const tableService = req.scope.resolve("table") as any
  
  try {
    const session = await tableService.retrieveTableSession(session_id)
    
    if (!session) {
      return res.status(404).json({
        error: "Table session not found"
      })
    }
    
    res.json({ session })
  } catch (error) {
    console.error("Error retrieving table session:", error)
    res.status(500).json({
      error: "Failed to retrieve table session"
    })
  }
} 