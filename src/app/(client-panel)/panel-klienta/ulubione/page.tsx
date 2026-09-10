import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { MOCK_PRODUCTS } from "@/data/mock-store-data"
import auth from "@/lib/auth"

import { ProductCard } from "@/components/store-front/product-card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Избранное",
  description: "Сохранённые изделия в интернет-магазине AURA TALISMAN",
}

export default async function ClientPanelFavouritesPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const favorites = MOCK_PRODUCTS.slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight">Избранное</h1>
        <p className="text-sm text-muted-foreground">
          Ваши сохраненные браслеты и талисманы
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </div>
  )
}
