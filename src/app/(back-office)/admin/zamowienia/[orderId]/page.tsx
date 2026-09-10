import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getOrderById, getOrderLineItems } from "@/actions/order"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"
import { formatDate, formatId, formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Детали заказа | AURA TALISMAN",
  description: "Просмотр деталей и состава заказа",
}

interface AdminOrderPageProps {
  params: {
    orderId: string
  }
}

export default async function AdminOrderPage({
  params,
}: Readonly<AdminOrderPageProps>) {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const order = await getOrderById({ id: params.orderId })
  if (!order) notFound()

  const orderLineItems = await getOrderLineItems({
    items: String(order.items),
  })

  const totalAmount = Number(order.amount) || orderLineItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  const isPaid = order.stripePaymentIntentStatus === "succeeded"

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6 max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/zamowienia"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Вернуться ко всем заказам
        </Link>
        <Badge variant={isPaid ? "default" : "secondary"}>
          {isPaid ? "Оплачено онлайн" : "В обработке"}
        </Badge>
      </div>

      <Card className="rounded-md">
        <CardHeader className="space-y-1 bg-muted/40 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Заказ #{formatId(order.id)}
              </CardTitle>
              <CardDescription>
                Оформлен: {order.createdAt ? formatDate(order.createdAt) : "Не указано"}
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Итоговая сумма</span>
              <span className="text-2xl font-bold text-amber-600">
                {formatPrice(totalAmount.toString())}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-accent/30 text-sm">
            <div className="space-y-2">
              <span className="font-semibold block text-base">Информация о покупателе</span>
              <div className="space-y-1 text-muted-foreground">
                <p><strong className="text-foreground">Имя:</strong> {order.name || "Клиент AURA"}</p>
                <p><strong className="text-foreground">Email:</strong> {order.email || "Не указан"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="font-semibold block text-base">Доставка и Оплата</span>
              <div className="space-y-1 text-muted-foreground">
                <p><strong className="text-foreground">Способ оплаты:</strong> Kaspi QR / Банковская карта</p>
                <p><strong className="text-foreground">Доставка:</strong> Курьерская доставка по Казахстану</p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Состав заказа ({orderLineItems.length} поз.)</h3>
            <div className="space-y-2">
              {orderLineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {item.images?.[0]?.url ? (
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.images[0].url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground text-xs">
                        Фото
                      </div>
                    )}
                    <div className="space-y-1">
                      <Link
                        href={`/produkty/${item.id}`}
                        className="font-medium hover:underline text-sm md:text-base line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-muted-foreground block">
                        Категория: {item.categoryName} • {formatPrice(item.price)} за шт.
                      </span>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap pl-4">
                    <span className="font-semibold text-sm md:text-base">
                      {formatPrice((Number(item.price) * item.quantity).toString())}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {item.quantity} шт.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Сумма товаров:</span>
                <span>{formatPrice(totalAmount.toString())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Доставка курьером:</span>
                <span>Бесплатно (Акция)</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Итого к оплате:</span>
                <span className="text-amber-600">{formatPrice(totalAmount.toString())}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 border-t px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Статус заказа синхронизирован
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/zamowienia">
              Закрыть
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
