import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import type { SearchParams } from "@/types"
import { asc, desc, like, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db, isDbConfigured } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { subcategories, type Subcategory } from "@/db/schema"
import { productSubcategoriesSearchParamsSchema } from "@/validations/params"
import { mockSubcategories } from "@/data/mock-store-data"

import auth from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { SubcategoriesTableShell } from "@/components/shells/subcategories-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Подкатегории | AURA TALISMAN",
  description: "Управление подкатегориями товаров магазина",
}

interface AdminSubcategoriesPageProps {
  searchParams: SearchParams
}

export default async function AdminSubcategoriesPage({
  searchParams,
}: Readonly<AdminSubcategoriesPageProps>): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const { page, per_page, sort, name } =
    productSubcategoriesSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const [column, order] = (sort?.split(".") as [
    keyof Subcategory | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  let data: any[] = []
  let count = 0

  const fallbackSubcats = [
    {
      id: "subcat-1",
      name: "Из вулканической лавы",
      categoryName: "bransoletki",
      createdAt: new Date("2026-06-01"),
      updatedAt: new Date("2026-08-10"),
    },
    {
      id: "subcat-2",
      name: "По 7 Чакрам",
      categoryName: "bransoletki",
      createdAt: new Date("2026-06-05"),
      updatedAt: new Date("2026-08-12"),
    },
    {
      id: "subcat-3",
      name: "На достаток и успех",
      categoryName: "bransoletki",
      createdAt: new Date("2026-06-10"),
      updatedAt: new Date("2026-08-15"),
    },
    {
      id: "subcat-4",
      name: "108 бусин (Мала)",
      categoryName: "chetki",
      createdAt: new Date("2026-06-12"),
      updatedAt: new Date("2026-08-20"),
    },
    {
      id: "subcat-5",
      name: "33 бусины",
      categoryName: "chetki",
      createdAt: new Date("2026-06-15"),
      updatedAt: new Date("2026-08-22"),
    },
    {
      id: "subcat-6",
      name: "Лава и Рудракша",
      categoryName: "chetki",
      createdAt: new Date("2026-06-18"),
      updatedAt: new Date("2026-08-25"),
    },
    {
      id: "subcat-7",
      name: "Натуральный малахит",
      categoryName: "naszyjniki",
      createdAt: new Date("2026-06-20"),
      updatedAt: new Date("2026-08-28"),
    },
    {
      id: "subcat-8",
      name: "Барочный жемчуг",
      categoryName: "naszyjniki",
      createdAt: new Date("2026-06-22"),
      updatedAt: new Date("2026-08-29"),
    },
  ]

  if (!isDbConfigured) {
    data = fallbackSubcats
    count = data.length
  } else {
    try {
      data = await db
        .select({
          id: subcategories.id,
          name: subcategories.name,
          categoryName: subcategories.categoryName,
          createdAt: subcategories.createdAt,
          updatedAt: subcategories.updatedAt,
        })
        .from(subcategories)
        .limit(limit)
        .offset(offset)
        .where(name ? like(subcategories.name, `%${name}%`) : undefined)
        .orderBy(
          column && column in subcategories
            ? order === "asc"
              ? asc(subcategories[column])
              : desc(subcategories[column])
            : desc(subcategories.createdAt)
        )

      count = await db
        .select({
          count: sql<number>`count(${subcategories.id})`,
        })
        .from(subcategories)
        .where(name ? like(subcategories.name, `%${name}%`) : undefined)
        .then((res) => res[0]?.count ?? 0)
    } catch (error) {
      data = fallbackSubcats
      count = data.length
    }
  }

  const pageCount = Math.ceil(count / limit)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Подкатегории товаров
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Update column count */}
          <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
            <SubcategoriesTableShell
              data={data ? data : []}
              pageCount={pageCount ? pageCount : 0}
            />
          </React.Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
