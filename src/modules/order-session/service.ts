import { MedusaService } from "@medusajs/framework/utils"
import { OrderSession } from "./models"

type OrderItem = {
  product_id: string
  variant_id: string
  quantity: number
  unit_price: number
  total_price: number
  name: string
  description?: string
  image_url?: string
}

type InjectedDependencies = {
  // Add any injected dependencies here
}

class OrderSessionModuleService extends MedusaService({
  OrderSession,
}) {
  protected dependencies_: InjectedDependencies

  constructor(container: InjectedDependencies) {
    super(...arguments)
    this.dependencies_ = container
  }

  async createOrderSessionForTable(data: {
    table_session_id: string
    business_id: string
    customer_name?: string
  }) {
    return await this.createOrderSessions({
      ...data,
      status: "active",
      items: { list: [] } as any,
      subtotal: 0,
      tax_amount: 0,
      tip_amount: 0,
      total_amount: 0,
    })
  }

  async addItemToOrder(
    orderSessionId: string,
    item: OrderItem
  ) {
    const orderSession = await this.retrieveOrderSession(orderSessionId)
    
    const itemsData = orderSession.items as any || { list: [] }
    const items = [...(itemsData.list || [])]
    const existingItemIndex = items.findIndex(
      (i) => i.variant_id === item.variant_id
    )

    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += item.quantity
      items[existingItemIndex].total_price = 
        items[existingItemIndex].quantity * items[existingItemIndex].unit_price
    } else {
      items.push(item)
    }

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0)
    const taxRate = 0.1 // 10% tax, should be configurable
    const tax_amount = Math.round(subtotal * taxRate)
    const total_amount = subtotal + tax_amount + Number(orderSession.tip_amount)

    return await this.updateOrderSessions({
      id: orderSessionId,
      items: { list: items } as any,
      subtotal,
      tax_amount,
      total_amount,
    })
  }

  async removeItemFromOrder(
    orderSessionId: string,
    variantId: string
  ) {
    const orderSession = await this.retrieveOrderSession(orderSessionId)
    
    const itemsData = orderSession.items as any || { list: [] }
    const items = (itemsData.list || []).filter(
      (i) => i.variant_id !== variantId
    )

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0)
    const taxRate = 0.1 // 10% tax, should be configurable
    const tax_amount = Math.round(subtotal * taxRate)
    const total_amount = subtotal + tax_amount + Number(orderSession.tip_amount)

    return await this.updateOrderSessions({
      id: orderSessionId,
      items: { list: items } as any,
      subtotal,
      tax_amount,
      total_amount,
    })
  }

  async updateItemQuantity(
    orderSessionId: string,
    variantId: string,
    quantity: number
  ) {
    const orderSession = await this.retrieveOrderSession(orderSessionId)
    
    const itemsData = orderSession.items as any || { list: [] }
    const items = [...(itemsData.list || [])]
    const itemIndex = items.findIndex((i) => i.variant_id === variantId)

    if (itemIndex === -1) {
      throw new Error("Item not found in order")
    }

    if (quantity <= 0) {
      return this.removeItemFromOrder(orderSessionId, variantId)
    }

    items[itemIndex].quantity = quantity
    items[itemIndex].total_price = quantity * items[itemIndex].unit_price

    const subtotal = items.reduce((sum, i) => sum + i.total_price, 0)
    const taxRate = 0.1 // 10% tax, should be configurable
    const tax_amount = Math.round(subtotal * taxRate)
    const total_amount = subtotal + tax_amount + Number(orderSession.tip_amount)

    return await this.updateOrderSessions({
      id: orderSessionId,
      items: { list: items } as any,
      subtotal,
      tax_amount,
      total_amount,
    })
  }

  async addTip(orderSessionId: string, tipAmount: number) {
    const orderSession = await this.retrieveOrderSession(orderSessionId)
    
    const total_amount = 
      Number(orderSession.subtotal) + 
      Number(orderSession.tax_amount) + 
      tipAmount

    return await this.updateOrderSessions({
      id: orderSessionId,
      tip_amount: tipAmount,
      total_amount,
    })
  }

  async submitOrder(orderSessionId: string) {
    return await this.updateOrderSessions({
      id: orderSessionId,
      status: "submitted",
      submitted_at: new Date(),
    })
  }

  async getActiveOrdersForTableSession(tableSessionId: string) {
    return await this.listOrderSessions({
      table_session_id: tableSessionId,
      status: ["active", "submitted", "preparing", "ready"],
    })
  }

  async findActiveOrderForTableSession(table_session_id: string) {
    const orders = await this.listOrderSessions({
      table_session_id,
      status: ["active"],
    });
    return orders && orders.length > 0 ? orders[0] : null;
  }
}

export default OrderSessionModuleService