import { MedusaService } from "@medusajs/framework/utils"
import { Business } from "./models"

type InjectedDependencies = {
  // Add any injected dependencies here
}

class BusinessModuleService extends MedusaService({
  Business,
}) {
  protected dependencies_: InjectedDependencies

  constructor(container: InjectedDependencies) {
    super(...arguments)
    this.dependencies_ = container
  }

  async retrieveBySlug(slug: string) {
    const [business] = await this.listBusinesses({
      slug,
    })

    if (!business) {
      throw new Error(`Business with slug ${slug} not found`)
    }

    return business
  }

  async findBySlug(slug: string) {
    const [business] = await this.listBusinesses({
      slug,
    })

    return business || null
  }

  async createOrUpdateBusiness(data: any) {
    // Verificar si ya existe un negocio con este slug
    const existingBusiness = await this.findBySlug(data.slug)
    
    if (existingBusiness) {
      // Si existe, devolver el existente o actualizarlo
      console.log(`Business with slug ${data.slug} already exists, returning existing business`)
      return existingBusiness
    }
    
    // Si no existe, crear uno nuevo
    return await this.createBusinesses(data)
  }

  async getBusinessConfig(businessId: string) {
    const business = await this.retrieveBusiness(businessId)
    
    return {
      nombreComercio: business.name,
      eslogan: business.slogan || "",
      imagenPortada: business.cover_image_url || "",
      logo: business.logo_url || "",
      colores: business.theme_config.colors,
    }
  }
}

export default BusinessModuleService