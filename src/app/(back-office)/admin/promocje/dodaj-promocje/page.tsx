import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Создать промокод | AURA TALISMAN",
  description: "Создание нового промокода на скидку",
}

export default async function NewPromoPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6 max-w-2xl">
      <div className="mb-4">
        <Link
          href="/admin/promocje"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Назад к списку промокодов
        </Link>
      </div>

      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Новый промокод на скидку
          </CardTitle>
          <CardDescription>
            Заполните параметры промокода для магазина AURA TALISMAN
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/admin/promocje" method="GET" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код промокода (латиница)</Label>
              <Input
                id="code"
                placeholder="AURA2026"
                required
                className="font-mono uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Размер скидки</Label>
              <Input id="discount" placeholder="10% или 5 000 ₸" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Условия акции</Label>
              <Input
                id="description"
                placeholder="Скидка при заказе энергетических браслетов от 25 000 ₸"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Срок действия</Label>
              <Input id="expiry" placeholder="31.12.2026 или Бессрочно" />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit">Сохранить и активировать</Button>
              <Link
                href="/admin/promocje"
                className={buttonVariants({ variant: "outline" })}
              >
                Отмена
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
