"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, clearCart } from "@/actions/cart"
import { formatPrice } from "@/lib/utils"
import type { CartLineItem } from "@/validations/cart"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = React.useState<CartLineItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [orderComplete, setOrderComplete] = React.useState(false)
  const [orderId, setOrderId] = React.useState("")

  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("+7 (7")
  const [city, setCity] = React.useState("Алматы")
  const [address, setAddress] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("kaspi")

  React.useEffect(() => {
    async function loadCart() {
      try {
        const cartItems = await getCart()
        setItems(cartItems)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const cartTotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !address) {
      toast({
        title: "Заполните все поля",
        description: "Укажите имя, контактный телефон и адрес доставки",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const newOrderId = `#KZ-${Math.floor(1000 + Math.random() * 9000)}`
    
    // Simulate order placement
    setTimeout(async () => {
      await clearCart()
      setOrderId(newOrderId)
      setOrderComplete(true)
      setIsSubmitting(false)
      toast({
        title: "Заказ успешно оформлен!",
        description: `Номер вашего заказа: ${newOrderId}`,
      })
    }, 800)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Icons.spinner className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <Icons.check className="size-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Благодарим за ваш заказ!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Заказ <span className="font-semibold text-foreground">{orderId}</span> успешно принят в работу
        </p>
        <Card className="mt-6 w-full text-left shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-serif">Детали доставки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><b>Получатель:</b> {name}</p>
            <p><b>Телефон:</b> {phone}</p>
            <p><b>Адрес:</b> г. {city}, {address}</p>
            <p><b>Способ оплаты:</b> {paymentMethod === "kaspi" ? "Kaspi QR / Перевод" : paymentMethod === "card" ? "Банковская карта" : "Оплата курьеру"}</p>
            <p><b>Сумма к оплате:</b> <span className="font-bold text-amber-700 dark:text-amber-400">{formatPrice(cartTotal)}</span></p>
          </CardContent>
        </Card>
        <p className="mt-4 text-xs text-muted-foreground">
          Наш мастер свяжется с вами в течение 15 минут для уточнения размера запястья и времени доставки.
        </p>
        <Link href="/" className="mt-6">
          <Button className="rounded-full px-8">Вернуться на главную</Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <Icons.shoppingCart className="mb-4 size-16 text-muted-foreground/40" />
        <h2 className="text-2xl font-serif font-bold">Ваша корзина пуста</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Выберите изделия из натуральных минералов в нашем каталоге
        </p>
        <Link href="/kategorie/bransoletki" className="mt-6">
          <Button className="rounded-full">Перейти в каталог</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          Оформление заказа
        </h1>
        <p className="text-sm text-muted-foreground">
          Бережная курьерская доставка по Казахстану и СНГ
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Form Fields */}
          <div className="space-y-6 lg:col-span-7">
            {/* Contact Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-serif">1. Контактные данные</CardTitle>
                <CardDescription>
                  Для уведомлений о статусе и подтверждения заказа
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ваше имя и фамилия *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Алихан Сейфуллин"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Номер телефона (WhatsApp) *</Label>
                  <Input
                    id="phone"
                    required
                    placeholder="+7 (777) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-serif">2. Адрес доставки</CardTitle>
                <CardDescription>Курьерская доставка до двери</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Город *</Label>
                  <Input
                    id="city"
                    required
                    placeholder="Алматы, Астана, Шымкент..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Улица, дом, квартира *</Label>
                  <Input
                    id="address"
                    required
                    placeholder="пр. Достык, д. 128, кв. 45"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-serif">3. Способ оплаты</CardTitle>
                <CardDescription>Выберите удобный способ</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/40">
                    <RadioGroupItem value="kaspi" id="p-kaspi" />
                    <Label htmlFor="p-kaspi" className="flex-1 cursor-pointer font-medium">
                      Kaspi Pay (QR / Перевод)
                      <span className="block text-xs font-normal text-muted-foreground">
                        Выставим счёт в приложении Kaspi.kz после оформления
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/40">
                    <RadioGroupItem value="card" id="p-card" />
                    <Label htmlFor="p-card" className="flex-1 cursor-pointer font-medium">
                      Банковская карта (Visa / Mastercard)
                      <span className="block text-xs font-normal text-muted-foreground">
                        Безопасная оплата картой любого банка
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/40">
                    <RadioGroupItem value="courier" id="p-courier" />
                    <Label htmlFor="p-courier" className="flex-1 cursor-pointer font-medium">
                      Оплата курьеру при получении
                      <span className="block text-xs font-normal text-muted-foreground">
                        Наличными или картой при вручении посылки
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <Card className="sticky top-20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Ваш заказ</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? "изделие" : "изделия"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="divide-y text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2.5">
                      <div className="pr-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} шт. × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground shrink-0">
                        {formatPrice((Number(item.price) * item.quantity).toFixed(2))}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка по Казахстану</span>
                    <span className="font-medium text-emerald-600">Бесплатно</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Подарочная упаковка</span>
                    <span className="font-medium">В подарок</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base font-bold">
                    <span>Итого к оплате</span>
                    <span className="text-amber-700 dark:text-amber-400">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full py-6 text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                      <span>Оформление...</span>
                    </>
                  ) : (
                    <span>Подтвердить заказ • {formatPrice(cartTotal)}</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
