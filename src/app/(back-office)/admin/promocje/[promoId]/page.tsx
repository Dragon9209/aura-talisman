import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getPromoById } from "@/actions/promo"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
  title: "Детали промокода | AURA TALISMAN",
  description: "Просмотр параметров промокода",
}

interface AdminPromoPageProps {
  params: {
    promoId: string
  }
}

export default async function AdminPromoPage({
  params,
}: Readonly<AdminPromoPageProps>): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  const promo = await getPromoById({ id: params.promoId })
  if (!promo) notFound()

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6 max-w-2xl space-y-4">
      <div className="mb-2">
        <Link
          href="/admin/promocje"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Назад к списку промокодов
        </Link>
      </div>

      <Card className="rounded-md">
        <CardHeader className="bg-muted/40 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold font-mono tracking-wider">
                {promo.code}
              </CardTitle>
              <CardDescription>
                Параметры скидочного промокода
              </CardDescription>
            </div>
            <Badge variant={promo.status === "active" ? "default" : "secondary"}>
              {promo.status === "active" ? "Активен" : "Неактивен"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <span className="text-xs text-muted-foreground block">Размер скидки</span>
              <span className="text-xl font-bold text-amber-600">{promo.discount}</span>
            </div>
            <div className="rounded-lg border p-3">
              <span className="text-xs text-muted-foreground block">Использований</span>
              <span className="text-xl font-bold">{promo.usageCount} раз</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <span className="font-semibold block text-muted-foreground text-xs uppercase tracking-wider">
                Условия и описание
              </span>
              <p className="mt-1 font-medium">{promo.description}</p>
            </div>

            <div>
              <span className="font-semibold block text-muted-foreground text-xs uppercase tracking-wider">
                Срок действия
              </span>
              <p className="mt-1 font-medium">{promo.expiresAt}</p>
            </div>

            <div>
              <span className="font-semibold block text-muted-foreground text-xs uppercase tracking-wider">
                Тип применения
              </span>
              <p className="mt-1 font-medium">
                {promo.type === "percent"
                  ? "Процент от суммы заказа"
                  : promo.type === "fixed"
                    ? "Фиксированная сумма скидки в тенге"
                    : "Бесплатная доставка курьером"}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 border-t px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin/promocje"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            К списку промокодов
          </Link>
          <Button size="sm">
            Скопировать промокод
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
