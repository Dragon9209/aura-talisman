"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"

export function AnalyticsDashboard() {
  const topStones = [
    { name: "Вулканическая лава", share: 38, amount: "1 858 960 ₸", count: 94, color: "bg-stone-800" },
    { name: "Черный агат", share: 24, amount: "1 174 080 ₸", count: 60, color: "bg-slate-700" },
    { name: "Тигровый глаз", share: 18, amount: "880 560 ₸", count: 45, color: "bg-amber-600" },
    { name: "Малахит и самоцветы", share: 12, amount: "587 040 ₸", count: 30, color: "bg-emerald-600" },
    { name: "Рудракша и семена", share: 8, amount: "391 360 ₸", count: 19, color: "bg-orange-700" },
  ]

  const cities = [
    { city: "Алматы", share: 44, orders: 109, percent: "44%" },
    { city: "Астана", share: 31, orders: 77, percent: "31%" },
    { city: "Шымкент", share: 14, orders: 35, percent: "14%" },
    { city: "Караганда", share: 6, orders: 15, percent: "6%" },
    { city: "Другие города РК", share: 5, orders: 12, percent: "5%" },
  ]

  const paymentMethods = [
    { name: "Kaspi QR / Kaspi Pay", share: "74%", count: "184 заказа", badge: "default" },
    { name: "Банковские карты (Visa / MC)", share: "21%", count: "52 заказа", badge: "secondary" },
    { name: "Наличными при получении", share: "5%", count: "12 заказов", badge: "outline" },
  ]

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Аналитика и финансовые отчеты
          </h1>
          <p className="text-sm text-muted-foreground">
            Показатели продаж, популярность камней и география заказов AURA TALISMAN
          </p>
        </div>
        <DateRangePicker align="end" />
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Выручка магазина
            </span>
            <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-500">
              <Icons.creditCard className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            4 892 000 ₸
          </div>
          <div className="mt-1 flex items-center text-xs text-emerald-600">
            <Icons.check className="mr-1 size-3" />
            <span>+18.4% по сравнению с прошлым месяцем</span>
          </div>
        </Card>

        <Card className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Оформлено заказов
            </span>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Icons.shoppingCart className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            248
          </div>
          <div className="mt-1 flex items-center text-xs text-emerald-600">
            <Icons.check className="mr-1 size-3" />
            <span>+14.2% к предыдущему периоду</span>
          </div>
        </Card>

        <Card className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Средний чек
            </span>
            <div className="rounded-md bg-amber-500/10 p-2 text-amber-500">
              <Icons.creditCard className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            19 725 ₸
          </div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <span>В среднем 1.8 изделий в одном чеке</span>
          </div>
        </Card>

        <Card className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Повторные покупки
            </span>
            <div className="rounded-md bg-purple-500/10 p-2 text-purple-500">
              <Icons.users className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            32.4%
          </div>
          <div className="mt-1 flex items-center text-xs text-emerald-600">
            <Icons.check className="mr-1 size-3" />
            <span>Высокая лояльность к бренду</span>
          </div>
        </Card>
      </div>

      {/* Breakdown Grid: Stones popularity & Geography */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stone distribution */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Популярность минералов и камней
            </CardTitle>
            <CardDescription>
              Доля в выручке и количество купленных браслетов по типам минералов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topStones.map((stone) => (
              <div key={stone.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stone.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{stone.count} шт.</span>
                    <span className="font-semibold">{stone.amount} ({stone.share}%)</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stone.color}`}
                    style={{ width: `${stone.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Kazakhstan Distribution */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              География заказов по Казахстану
            </CardTitle>
            <CardDescription>
              Распределение отправок через СДЭК, Казпочту и курьерскую доставку
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cities.map((item) => (
              <div key={item.city} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.orders} заказов</span>
                    <span className="font-semibold">{item.percent}</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: item.percent }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Payment methods & Live Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Channels */}
        <Card className="rounded-md lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Способы оплаты
            </CardTitle>
            <CardDescription>
              Предпочтения покупателей при оформлении
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium text-sm">{method.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {method.count}
                  </div>
                </div>
                <Badge variant={method.badge as any} className="text-sm font-semibold">
                  {method.share}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Performance Highlights */}
        <Card className="rounded-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Ключевые инсайты продаж
            </CardTitle>
            <CardDescription>
              Рекомендации для мастера по производству талисманов и закупкам минералов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border bg-accent/30 p-3.5 text-sm">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Icons.check className="size-4 text-emerald-500" />
                Высокий спрос на вулканическую лаву и рудракшу
              </div>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Чётки на 108 бусин из лавы с рудракшей распродаются быстрее всего. Рекомендуется увеличить остатки в категории «Чётки и Малы» на 20-30 единиц.
              </p>
            </div>

            <div className="rounded-lg border bg-accent/30 p-3.5 text-sm">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Icons.check className="size-4 text-emerald-500" />
                Лидерство Kaspi QR при оплате
              </div>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                74% всех платежей совершаются моментально через Kaspi. Промокод KASPI5 дополнительно стимулирует предоплату и исключает отказы при доставке.
              </p>
            </div>

            <div className="rounded-lg border bg-accent/30 p-3.5 text-sm">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Icons.check className="size-4 text-emerald-500" />
                Алматы и Астана формируют 75% всей выручки
              </div>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Срок доставки курьером день в день в Алматы и 1-2 дня в Астану является решающим фактором для покупателей подарков и талисманов.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
