import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { tableId } = req.params
  const tableService = req.scope.resolve("table") as any

  try {
    // 1. Buscar la table por ID
    const [table] = await tableService.listTables({ id: tableId })
    if (!table) {
      return res.status(404).json({ error: "Table not found" })
    }

    // 2. Obtener el business_id de la table
    const businessId = table.business_id

    // 3. Hacer llamada HTTP interna al endpoint que ya funciona
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const productsUrl = `${baseUrl}/api/store/comercio/${businessId}/productos`
    
    try {
      const response = await fetch(productsUrl)
      const products = await response.json()
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${products.error || 'Unknown error'}`)
      }
      
      res.json(products)
    } catch (httpError) {
      console.error("Error en llamada HTTP a productos:", httpError)
      res.status(500).json({
        error: "Error obteniendo products del business",
        details: httpError.message
      })
    }

  } catch (error) {
    console.error("Error en GET /menu/:tableId:", error)
    res.status(500).json({ error: "Error obteniendo table" })
  }
} 