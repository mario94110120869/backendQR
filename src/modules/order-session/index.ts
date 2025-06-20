import { Module } from "@medusajs/framework/utils"
import OrderSessionModuleService from "./service"

export const ORDER_SESSION_MODULE = "orderSession"

export default Module(ORDER_SESSION_MODULE, {
  service: OrderSessionModuleService,
})