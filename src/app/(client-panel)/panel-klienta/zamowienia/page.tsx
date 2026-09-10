import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import auth from "@/lib/auth"

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

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Мои заказы",
  description: "История заказов в интернет-магазине AURA TALISMAN",
}

export default async function ClientPanelOrdersPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight">Мои заказы</h1>
        <p className="text-sm text-muted-foreground">
          Отслеживайте статус доставки и просматривайте историю покупок
        </p>
      </div>

      <Card className="rounded-lg shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-lg">Заказ #KZ-8492</CardTitle>
            <CardDescription>Оформлен: 08 сентября 2026, 14:30</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Доставлен
          </Badge>
        </CardHeader>
        <CardContent className="pt-4 text-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-foreground">
                Лавовый браслет «Сила Вулкана» (Вулканическая лава + Чёрный агат)
              </p>
              <p className="text-xs text-muted-foreground">
                Количество: 1 шт. • Размер запястья: 17–18 см • Бусины: 8 мм
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-amber-600">18 500 ₸</span>
              <p className="text-[11px] text-muted-foreground">Оплачено Kaspi QR / Картой</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 py-3 text-xs text-muted-foreground">
          <span>Доставка курьером: г. Алматы</span>
          <Link href="/kategorie/bransoletki">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Повторить заказ
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
