import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { IProductModuleService, IPricingModuleService } from "@medusajs/framework/types"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id: businessId } = req.params;
  const regionId = "reg_01JXWC37Y91KEWC2EBX8ZCDXYF"
  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  const pricingService: IPricingModuleService = req.scope.resolve("pricing")

  try {
    const [productsList, count] = await productService.listAndCountProducts(
      {},
      {
        relations: [ "variants" ],
      }
    )

    const allVariantIds = productsList.flatMap(p => p.variants.map(v => v.id))
    
    if (allVariantIds.length === 0) {
      return res.json({ products: productsList, count });
    }

    const allPrices = await pricingService.calculatePrices({ id: allVariantIds }, {
      context: {
        region_id: regionId,
        currency_code: "eur"
      }
    })

    // --- DEBUGGING LOG ---
    console.log("Calculated prices response:", JSON.stringify(allPrices, null, 2));

    const enrichedProducts = productsList.map(product => {
      const variantsWithPrices = product.variants.map(variant => ({
        ...variant,
        calculated_price: allPrices[variant.id] || null
      }));
      return {
        ...product,
        variants: variantsWithPrices
      };
    });

    res.json({
      products: enrichedProducts,
      count,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({
      error: "Error fetching products",
      details: error.message,
    })
  }
}