import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAllCategories } from "@/actions/category"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddSubcategoryForm } from "@/components/forms/inventory/subcategory/add-subcategory-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Добавить подкатегорию | AURA TALISMAN",
  description: "Добавление новой подкатегории товаров",
}

export default async function NewSubcategoryPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const categories = await getAllCategories()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Добавить новую подкатегорию
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddSubcategoryForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
