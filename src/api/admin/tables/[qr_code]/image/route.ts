import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import QRCode from "qrcode"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { qr_code } = req.params
  
  const tableService = req.scope.resolve("table") as any
  
  try {
    // Verificar que la mesa existe
    const table = await tableService.retrieveByQRCode(qr_code)
    
    if (!table) {
      return res.status(404).json({
        error: "Table not found"
      })
    }

    // Generar la URL que contendrá el QR
    // En producción, esto debería ser la URL de tu frontend
    //const qrUrl = `${req.protocol}://${req.get('host')}/store/tables/${qr_code}/join`
    //const qrUrl = `http://localhost:5173/${qr_code}`
    const qrUrl = `https://miweb.com/${qr_code}`
    
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
    
    // Enviar la imagen
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Length', imageBuffer.length)
    res.send(imageBuffer)
    
  } catch (error) {
    console.error("Error generating QR code:", error)
    res.status(500).json({
      error: "Failed to generate QR code"
    })
  }
} 