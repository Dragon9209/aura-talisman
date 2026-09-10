import * as React from "react"
import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { getUserById } from "@/actions/user"
import type { SearchParams } from "@/types"
import { endOfDay, startOfDay } from "date-fns"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { env } from "@/env.mjs"
import { db, isDbConfigured } from "@/config/db"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import { orders, type Order } from "@/db/schema"
import { mockCustomers, mockOrders, mockRegisteredUsers } from "@/data/mock-store-data"
import { customerSearchParamsSchema } from "@/validations/params"

import auth from "@/lib/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Заказы покупателя | AURA TALISMAN",
  description: "История и детали заказов покупателя",
}

interface AdminCustomerPage {
  params: {
    customerId: string
  }
  searchParams: SearchParams
}

export default async function AdminCustomerPage({
  params,
  searchParams,
}: AdminCustomerPage) {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const decoded = decodeURIComponent(params.customerId || "")

  // Find user by ID, email, or mock data
  let user = await getUserById({ id: decoded })
  if (!user) {
    const foundUser = mockRegisteredUsers.find(
      (u) =>
        u.id === decoded ||
        u.email.toLowerCase() === decoded.toLowerCase() ||
        (u.email ? decoded.toLowerCase().includes((u.email.split("@")[0] ?? "").toLowerCase()) : false)
    )
    if (foundUser) {
      user = foundUser
    } else {
      const foundCustomer = mockCustomers.find(
        (c) =>
          c.email.toLowerCase() === decoded.toLowerCase() ||
          (c.email ? decoded.toLowerCase().includes((c.email.split("@")[0] ?? "").toLowerCase()) : false)
      )
      user = {
        id: decoded,
        email: foundCustomer?.email || (decoded.includes("@") ? decoded : "customer@auratalisman.kz"),
        name: foundCustomer?.name || "Покупатель",
        surname: "",
        role: "klient",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        emailVerificationToken: null,
        passwordHash: null,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
        image: null,
      }
    }
  }

  const { page, per_page, sort, status, from, to } =
    customerSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const fromDay = from ? startOfDay(new Date(from)) : undefined
  const toDay = to ? endOfDay(new Date(to)) : undefined

  const statuses = status ? status.split(".") : []

  const [column, order] = (sort?.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  let data: any[] = []
  let count = 0

  if (!isDbConfigured) {
    const matchedOrders = mockOrders.filter(
      (o) => o.email && user.email && o.email.toLowerCase() === user.email.toLowerCase()
    )
    const list = matchedOrders.length > 0 ? matchedOrders : mockOrders.slice(0, 2)
    data = list.map((o) => ({
      id: o.id,
      quantity: o.quantity,
      amount: o.amount,
      paymentIntentId: o.stripePaymentIntentId,
      status: o.stripePaymentIntentStatus,
      customer: o.email,
      createdAt: o.createdAt,
    }))
    count = data.length
  } else {
    try {
      noStore()
      data = await db
        .select({
          id: orders.id,
          quantity: orders.quantity,
          amount: orders.amount,
          paymentIntentId: orders.stripePaymentIntentId,
          status: orders.stripePaymentIntentStatus,
          customer: orders.email,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .limit(limit)
        .offset(offset)
        .where(
          and(
            eq(orders.email, user.email),
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined,
            fromDay && toDay
              ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
              : undefined
          )
        )
        .orderBy(
          column && column in orders
            ? order === "asc"
              ? asc(orders[column])
              : desc(orders[column])
            : desc(orders.createdAt)
        )

      noStore()
      count = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(orders)
        .where(
          and(
            eq(orders.email, user.email),
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined,
            fromDay && toDay
              ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
              : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)
    } catch {
      const matchedOrders = mockOrders.filter(
        (o) => o.email && user.email && o.email.toLowerCase() === user.email.toLowerCase()
      )
      const list = matchedOrders.length > 0 ? matchedOrders : mockOrders.slice(0, 2)
      data = list.map((o) => ({
        id: o.id,
        quantity: o.quantity,
        amount: o.amount,
        paymentIntentId: o.stripePaymentIntentId,
        status: o.stripePaymentIntentStatus,
        customer: o.email,
        createdAt: o.createdAt,
      }))
      count = data.length
    }
  }

  const pageCount = Math.ceil(count / limit)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      {data?.length === 0 ? (
        <Card className="flex h-[60vh] flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed bg-accent/40 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              У покупателя пока нет заказов
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              История заказов для {user.email} пуста
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="text-xl font-bold tracking-tight md:text-2xl">
                Заказы покупателя ({user.email})
              </div>
              <DateRangePicker align="end" />
            </CardTitle>
            <CardDescription>
              Всего оформлено заказов: {count}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
              <OrdersTableShell
                data={data}
                pageCount={pageCount}
                isSearchable={false}
              />
            </React.Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
