import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import auth from "@/lib/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Личные данные",
  description: "Просмотр и редактирование личных данных AURA TALISMAN",
}

export default async function PersonalDataPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold">Личные данные</h2>
        <p className="text-sm text-muted-foreground">
          Управление контактной информацией вашего профиля
        </p>
      </div>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Профиль покупателя</CardTitle>
          <CardDescription>
            Эти данные используются для оформления заказов и связи с вами.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Ваше имя</Label>
            <Input id="name" defaultValue={session.user.name ?? "Алексей"} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Электронная почта</Label>
            <Input id="email" defaultValue={session.user.email ?? "client@aura-talisman.kz"} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Контактный телефон</Label>
            <Input id="phone" defaultValue="+7 (777) 123-45-67" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Основной город доставки</Label>
            <Input id="city" defaultValue="г. Алматы, Казахстан" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button>Сохранить изменения</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
