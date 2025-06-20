import { Module } from "@medusajs/framework/utils"
import TableModuleService from "./service"

export default Module("table", {
  service: TableModuleService,
})