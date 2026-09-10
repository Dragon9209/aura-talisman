import { type Metadata } from "next"
import { getAllActiveProducts } from "@/actions/product"

import { env } from "@/env.mjs"
import { type Product } from "@/db/schema"

import { ProductCard } from "@/components/store-front/product-card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Каталог изделий",
  description: "Авторские браслеты, четки и талисманы из натуральных минералов",
}

export default async function ProductsPage(): Promise<JSX.Element> {
  const products = await getAllActiveProducts()

  return (
    <div className="space-y-5 py-5">
      <h2 className="text-2xl font-semibold">Все авторские изделия</h2>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
