import { MedusaService } from "@medusajs/framework/utils"
import { Table, TableSession } from "./models"
import { v4 as uuidv4 } from "uuid"

type InjectedDependencies = {
  // Add any injected dependencies here
}

class TableModuleService extends MedusaService({
  Table,
  TableSession,
}) {
  protected dependencies_: InjectedDependencies

  constructor(container: InjectedDependencies) {
    super(...arguments)
    this.dependencies_ = container
  }

  async findByBusinessAndTableNumber(business_id: string, table_number: string) {
    const [table] = await this.listTables({
      business_id,
      table_number,
    })

    return table || null
  }

  async createTableWithQR(data: {
    business_id: string
    table_number: string
    name: string
  }) {
    // Verificar si ya existe una mesa con este número en este negocio
    const existingTable = await this.findByBusinessAndTableNumber(
      data.business_id,
      data.table_number
    )
    
    if (existingTable) {
      console.log(`Table ${data.table_number} for business ${data.business_id} already exists, returning existing table`)
      return existingTable
    }
    
    // Si no existe, crear una nueva con QR code
    const qr_code = uuidv4()
    
    return await this.createTables({
      ...data,
      qr_code,
    })
  }

  async createOrUpdateTable(data: {
    business_id: string
    table_number: string
    name: string
  }) {
    return await this.createTableWithQR(data)
  }

  async retrieveByQRCode(qr_code: string) {
    const [table] = await this.listTables({
      qr_code,
      is_active: true,
    })

    if (!table) {
      throw new Error(`Table with QR code ${qr_code} not found`)
    }

    return table
  }

  // Métodos de Sesión
  async startTableSession(tableId: string, businessId: string) {
    // Verificar si ya existe una sesión activa
    const activeSession = await this.getActiveTableSession(tableId)
    if (activeSession) {
      return activeSession
    }

    // Crear nueva sesión
    return await this.createTableSessions({
      id: uuidv4(),
      table_id: tableId,
      business_id: businessId,
      status: "active",
      started_at: new Date(),
    })
  }
  //////////////////////////////////////////
  //     Siempre Crea una nueva Sesión   //
  ////////////////////////////////////////
  async forceStartTableSession(tableId: string, businessId: string) {
    // Siempre crea una nueva sesión
    return await this.createTableSessions({
      id: uuidv4(),
      table_id: tableId,
      business_id: businessId,
      status: "active",
      started_at: new Date(),
    })
  }

  async getActiveTableSession(tableId: string) {
    const [session] = await this.listTableSessions({
      table_id: tableId,
      status: "active",
    })

    return session || null
  }

  async closeTableSession(sessionId: string) {
    const session = await this.retrieveTableSession(sessionId)
    
    if (!session) {
      throw new Error(`Table session ${sessionId} not found`)
    }

    if (session.status === "closed") {
      return session
    }

    return await this.updateTableSessions({
      id: sessionId,
      status: "closed",
      ended_at: new Date(),
    })
  }

  async retrieveTableById({ id, business_id }: { id: string, business_id: string }) {
    const [table] = await this.listTables({
      id,
      business_id,
    })
    return table || null
  }
}

export default TableModuleService