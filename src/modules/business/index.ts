import { Module } from "@medusajs/framework/utils"
import BusinessModuleService from "./service"

export const BUSINESS_MODULE = "business"

export default Module(BUSINESS_MODULE, {
  service: BusinessModuleService,
})