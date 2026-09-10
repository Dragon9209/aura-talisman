"use client"

import * as React from "react"
import Link from "next/link"
import { Icons } from "@/components/icons"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function AdminSettingsForm(): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  // General Settings State
  const [storeName, setStoreName] = React.useState("AURA TALISMAN")
  const [storeDesc, setStoreDesc] = React.useState(
    "Интернет-магазин авторских талисманов, энергетических браслетов и чёток из натуральной вулканической лавы и природных минералов."
  )
  const [phone, setPhone] = React.useState("+7 (777) 345-67-89")
  const [email, setEmail] = React.useState("info@auratalisman.kz")
  const [address, setAddress] = React.useState(
    "Казахстан, г. Алматы, пр. Достык, 128"
  )
  const [workingHours, setWorkingHours] = React.useState(
    "Пн-Вс: 10:00 — 21:00 (время Алматы, UTC+5)"
  )

  // Payments & Currency State
  const [kaspiPayEnabled, setKaspiPayEnabled] = React.useState(true)
  const [cardPayEnabled, setCardPayEnabled] = React.useState(true)
  const [cashOnDelivery, setCashOnDelivery] = React.useState(true)
  const [fiscalizationEnabled, setFiscalizationEnabled] = React.useState(true)

  // Delivery State
  const [almatyDeliveryPrice, setAlmatyDeliveryPrice] = React.useState("1500")
  const [cdekDeliveryPrice, setCdekDeliveryPrice] = React.useState("2500")
  const [kazpostDeliveryPrice, setKazpostDeliveryPrice] = React.useState("1200")
  const [freeShippingThreshold, setFreeShippingThreshold] =
    React.useState("20000")

  // Notifications State
  const [telegramAlerts, setTelegramAlerts] = React.useState(true)
  const [emailReceipts, setEmailReceipts] = React.useState(true)
  const [smsTracking, setSmsTracking] = React.useState(true)
  const [storeOnline, setStoreOnline] = React.useState(true)

  const handleSave = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      toast({
        title: "Настройки успешно сохранены",
        description:
          "Все параметры интернет-магазина AURA TALISMAN обновлены и применены.",
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Настройки магазина
            </h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-600 bg-amber-500/10">
              KZT / Казахстан
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Управление параметрами витрины, валютой (₸), способами оплаты, доставкой и оповещениями.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin">
              <Icons.chevronLeft className="mr-1.5 size-4" />
              Назад в панель
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icons.check className="mr-2 size-4" />
                Сохранить настройки
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">Основные</TabsTrigger>
          <TabsTrigger value="payments">Оплата и Валюта</TabsTrigger>
          <TabsTrigger value="shipping">Доставка по РК</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>

        {/* Tab 1: General */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Основные данные магазина</CardTitle>
              <CardDescription>
                Информация о бренде, контакты для клиентов и реквизиты витрины.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Название бренда / магазина</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="AURA TALISMAN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Режим работы службы заботы</Label>
                  <Input
                    id="workingHours"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="Пн-Вс: 10:00 — 21:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDesc">Краткое описание витрины</Label>
                <Textarea
                  id="storeDesc"
                  rows={3}
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp / Телефон для связи</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email для клиентских вопросов</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес мастерской / шоурума</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Статус витрины магазина</Label>
                  <p className="text-sm text-muted-foreground">
                    Если выключено, витрина переходит в режим технического обслуживания.
                  </p>
                </div>
                <Switch
                  checked={storeOnline}
                  onCheckedChange={setStoreOnline}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Payments & Currency */}
        <TabsContent value="payments" className="mt-4 space-y-4">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Валюта и интеграция платежей</CardTitle>
              <CardDescription>
                Настройка валюты каталога и способов приема платежей в Казахстане.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Основная валюта магазина</div>
                    <div className="text-sm text-muted-foreground">
                      Казахстанский тенге (KZT, символ ₸). Все цены отображаются в тенге.
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                    ₸ (KZT)
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Kaspi Pay / Оплата по Kaspi QR</span>
                      <Badge className="bg-red-500/15 text-red-600 border-red-500/30">
                        Популярно в РК
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Быстрая оплата сканированием QR-кода через приложение Kaspi.kz без комиссии для клиента.
                    </p>
                  </div>
                  <Switch
                    checked={kaspiPayEnabled}
                    onCheckedChange={setKaspiPayEnabled}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Банковские карты Visa / Mastercard</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Онлайн-эквайринг картами любых банков Казахстана и СНГ.
                    </p>
                  </div>
                  <Switch
                    checked={cardPayEnabled}
                    onCheckedChange={setCardPayEnabled}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <span className="font-medium">Оплата при получении курьеру</span>
                    <p className="text-sm text-muted-foreground">
                      Доступна для жителей Алматы (наличными или переводом курьеру).
                    </p>
                  </div>
                  <Switch
                    checked={cashOnDelivery}
                    onCheckedChange={setCashOnDelivery}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <span className="font-medium">Автоматическая фискализация (ОФД)</span>
                    <p className="text-sm text-muted-foreground">
                      Генерация электронных фискальных чеков согласно законодательству РК.
                    </p>
                  </div>
                  <Switch
                    checked={fiscalizationEnabled}
                    onCheckedChange={setFiscalizationEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Shipping */}
        <TabsContent value="shipping" className="mt-4 space-y-4">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Тарифы доставки по Казахстану</CardTitle>
              <CardDescription>
                Стоимость доставки курьерскими службами и порог бесплатной отправки.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="freeShipping">
                    Порог бесплатной доставки (₸)
                  </Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    При заказе на сумму от этой величины доставка бесплатна.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="almatyDelivery">
                    Курьер по Алматы (₸)
                  </Label>
                  <Input
                    id="almatyDelivery"
                    type="number"
                    value={almatyDeliveryPrice}
                    onChange={(e) => setAlmatyDeliveryPrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Доставка в день заказа или на следующий день.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cdekDelivery">
                    Экспресс СДЭК по городам РК (₸)
                  </Label>
                  <Input
                    id="cdekDelivery"
                    type="number"
                    value={cdekDeliveryPrice}
                    onChange={(e) => setCdekDeliveryPrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Астана, Шымкент, Караганда, Актобе (2-4 рабочих дня).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kazpostDelivery">
                    Казпочта в регионы РК (₸)
                  </Label>
                  <Input
                    id="kazpostDelivery"
                    type="number"
                    value={kazpostDeliveryPrice}
                    onChange={(e) => setKazpostDeliveryPrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Доставка в отдаленные районы и поселки (4-7 дней).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Notifications */}
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Оповещения и Безопасность</CardTitle>
              <CardDescription>
                Каналы информирования о новых заказах и трекинге отправлений.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <span className="font-medium">Мгновенные уведомления в Telegram</span>
                  <p className="text-sm text-muted-foreground">
                    Оповещение администратора в Telegram-бот при оформлении нового заказа.
                  </p>
                </div>
                <Switch
                  checked={telegramAlerts}
                  onCheckedChange={setTelegramAlerts}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <span className="font-medium">Email-подтверждение клиенту</span>
                  <p className="text-sm text-muted-foreground">
                    Отправка письма с деталями заказа, составом талисманов и фискальным чеком.
                  </p>
                </div>
                <Switch
                  checked={emailReceipts}
                  onCheckedChange={setEmailReceipts}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <span className="font-medium">SMS / WhatsApp трекинг</span>
                  <p className="text-sm text-muted-foreground">
                    Отправка ссылки на отслеживание посылки клиенту после передачи курьеру.
                  </p>
                </div>
                <Switch
                  checked={smsTracking}
                  onCheckedChange={setSmsTracking}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Сохранение..." : "Сохранить все настройки"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
