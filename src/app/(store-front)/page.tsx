import * as React from "react"
import { getAllCategories } from "@/actions/category"
import { getFeaturedProducts } from "@/actions/product"

import { StoreFront } from "@/components/store-front/store-front"

export default async function LandingPage(): Promise<JSX.Element> {
  const products = await getFeaturedProducts()
  const categories = await getAllCategories()

  return <StoreFront products={products} categories={categories} />
}
