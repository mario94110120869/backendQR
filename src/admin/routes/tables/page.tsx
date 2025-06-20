import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, Badge, Input, Label, Select } from "@medusajs/ui"
import { Plus, ComputerDesktop } from "@medusajs/icons"
import { useState, useEffect } from "react"

interface Table {
  id: string
  business_id: string
  table_number: string
  name: string
  qr_code: string
  is_active: boolean
  created_at: string
}

interface Business {
  id: string
  name: string
}

const TablesPage = () => {
  const [tables, setTables] = useState<Table[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    business_id: "",
    table_number: "",
    name: "",
  })

  // Cargar mesas
  const fetchTables = async () => {
    try {
      const response = await fetch("/admin/tables")
      const data = await response.json()
      setTables(data.tables || [])
    } catch (error) {
      console.error("Error fetching tables:", error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar negocios
  const fetchBusinesses = async () => {
    try {
      const response = await fetch("/admin/businesses")
      const data = await response.json()
      setBusinesses(data.businesses || [])
    } catch (error) {
      console.error("Error fetching businesses:", error)
    }
  }

  useEffect(() => {
    fetchTables()
    fetchBusinesses()
  }, [])

  // Crear nueva mesa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/admin/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTables()
        setShowForm(false)
        setFormData({ business_id: "", table_number: "", name: "" })
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating table:", error)
      alert("Error al crear la mesa")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getBusinessName = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId)
    return business?.name || businessId
  }

  if (loading) {
    return (
      <Container className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Cargando mesas...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Gestión de Mesas</Heading>
          <p className="text-gray-600 mt-1">
            Administra las mesas de tus locales
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          size="small"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancelar" : "Nueva Mesa"}
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="px-6 py-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="business_id">Negocio</Label>
                <Select
                  value={formData.business_id}
                  onValueChange={(value) => 
                    setFormData({ ...formData, business_id: value })
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Seleccionar negocio" />
                  </Select.Trigger>
                  <Select.Content>
                    {businesses.map((business) => (
                      <Select.Item key={business.id} value={business.id}>
                        {business.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="table_number">Número de Mesa</Label>
                <Input
                  id="table_number"
                  value={formData.table_number}
                  onChange={(e) => 
                    setFormData({ ...formData, table_number: e.target.value })
                  }
                  placeholder="ej: 001, A-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name">Nombre/Descripción</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => 
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ej: Mesa VIP, Terraza 1"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Crear Mesa
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de mesas */}
      <div className="px-6 py-4">
        {tables.length === 0 ? (
          <div className="text-center py-12">
            <ComputerDesktop className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay mesas registradas
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando tu primera mesa
            </p>
            <Button onClick={() => setShowForm(true)} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Mesa
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Mesa</Table.HeaderCell>
                <Table.HeaderCell>Negocio</Table.HeaderCell>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Código QR</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Creada</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tables.map((table) => (
                <Table.Row key={table.id}>
                  <Table.Cell>
                    <div className="font-medium">{table.table_number}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-sm">{getBusinessName(table.business_id)}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <div>{table.name}</div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      <ComputerDesktop className="w-4 h-4 text-gray-400" />
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {table.qr_code.substring(0, 8)}...
                      </code>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={table.is_active ? "green" : "red"}>
                      {table.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-sm text-gray-600">
                      {formatDate(table.created_at)}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Mesas",
  icon: ComputerDesktop,
})

export default TablesPage 