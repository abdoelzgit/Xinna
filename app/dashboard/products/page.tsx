import { getProducts, getCategories } from "@/lib/actions/product-actions"
import { ProductClient } from "./product-client"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <ProductClient
          initialProducts={products}
          categories={categories}
        />
      </div>
    </div>
  )
}
