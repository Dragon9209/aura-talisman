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
  title: "Добавить тег минерала | AURA TALISMAN",
  description: "Создание нового тега натурального камня",
}

export default async function NewTagPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6 max-w-2xl">
      <div className="mb-4">
        <Link
          href="/admin/tagi"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <Icons.chevronLeft className="mr-1 size-4" />
          Назад к тегам минералов
        </Link>
      </div>

      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
            Новый тег камня или минерала
          </CardTitle>
          <CardDescription>
            Добавление метафизических свойств и наименования для каталога
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/admin/tagi" method="GET" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Название тега</Label>
              <Input
                id="tag-name"
                placeholder="#лазурит"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Группа минералов</Label>
              <Input
                id="category"
                placeholder="Обереги и защита"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Свойства и значение камня</Label>
              <Input
                id="desc"
                placeholder="Укрепление духа, очищение мыслей, защита от сглаза"
              />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit">Создать тег</Button>
              <Link
                href="/admin/tagi"
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
