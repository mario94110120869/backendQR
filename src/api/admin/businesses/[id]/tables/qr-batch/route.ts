import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import QRCode from "qrcode"
import archiver from "archiver"
import { PassThrough } from "stream"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id: business_id } = req.params
  
  const tableService = req.scope.resolve("table") as any
  const businessService = req.scope.resolve("business") as any
  
  try {
    // Verificar que el negocio existe
    const business = await businessService.retrieveBusiness(business_id)
    if (!business) {
      return res.status(404).json({
        error: "Business not found"
      })
    }

    // Obtener todas las mesas del negocio
    const tables = await tableService.listTables({
      business_id,
      is_active: true
    })

    if (!tables.length) {
      return res.status(404).json({
        error: "No active tables found for this business"
      })
    }

    // Configurar el archivo ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 } // Máxima compresión
    })

    // Configurar los headers de la respuesta
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename=qrs-${business.slug}.zip`)

    // Pipe el archivo ZIP a la respuesta
    archive.pipe(res)

    // Generar QR para cada mesa
    for (const table of tables) {
      const qrUrl = `${req.protocol}://${req.get('host')}/store/tables/${table.qr_code}/join`
      
      // Generar el QR como una imagen PNG
      const qrImage = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })

      // Convertir el Data URL a Buffer
      const base64Data = qrImage.replace(/^data:image\/png;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')

      // Agregar el archivo al ZIP
      archive.append(imageBuffer, { 
        name: `qr-mesa-${table.table_number}.png` 
      })
    }

    // Finalizar el archivo ZIP
    await archive.finalize()

  } catch (error) {
    console.error("Error generating QR batch:", error)
    res.status(500).json({
      error: "Failed to generate QR batch"
    })
  }
} 