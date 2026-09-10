"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export interface PromoCode {
  id: string
  code: string
  discount: string
  type: "percent" | "fixed" | "shipping"
  description: string
  usageCount: number
  expiresAt: string
  status: "active" | "expired" | "disabled"
}

const INITIAL_PROMOS: PromoCode[] = [
  {
    id: "promo-1",
    code: "AURA10",
    discount: "10%",
    type: "percent",
    description: "Скидка 10% на все браслеты и чётки при заказе от 25 000 ₸",
    usageCount: 142,
    expiresAt: "31.12.2026",
    status: "active",
  },
  {
    id: "promo-2",
    code: "KASPI5",
    discount: "5%",
    type: "percent",
    description: "Скидка 5% при быстрой оплате через Kaspi QR",
    usageCount: 89,
    expiresAt: "31.12.2026",
    status: "active",
  },
  {
    id: "promo-3",
    code: "FREESHIP",
    discount: "Доставка 0 ₸",
    type: "shipping",
    description: "Бесплатная курьерская доставка по Алматы и всему Казахстану",
    usageCount: 311,
    expiresAt: "Бессрочно",
    status: "active",
  },
  {
    id: "promo-4",
    code: "TALISMAN20",
    discount: "20%",
    type: "percent",
    description: "Скидка 20% на второй браслет-талисман в одном заказе",
    usageCount: 64,
    expiresAt: "15.10.2026",
    status: "active",
  },
  {
    id: "promo-5",
    code: "STARTKZ",
    discount: "2 000 ₸",
    type: "fixed",
    description: "Приветственная скидка 2 000 ₸ для новых покупателей",
    usageCount: 205,
    expiresAt: "01.11.2026",
    status: "active",
  },
]

export function PromosManager() {
  const { toast } = useToast()
  const [promos, setPromos] = React.useState<PromoCode[]>(INITIAL_PROMOS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  // New promo form state
  const [code, setCode] = React.useState("")
  const [discount, setDiscount] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [expiresAt, setExpiresAt] = React.useState("")

  const filteredPromos = React.useMemo(() => {
    if (!searchQuery.trim()) return promos
    const q = searchQuery.toLowerCase()
    return promos.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }, [promos, searchQuery])

  const totalUsages = React.useMemo(() => {
    return promos.reduce((sum, p) => sum + p.usageCount, 0)
  }, [promos])

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !discount.trim()) return

    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount: discount.trim(),
      type: discount.includes("%") ? "percent" : "fixed",
      description: description.trim() || "Специальное предложение",
      usageCount: 0,
      expiresAt: expiresAt.trim() || "31.12.2026",
      status: "active",
    }

    setPromos((prev) => [newPromo, ...prev])
    setCode("")
    setDiscount("")
    setDescription("")
    setExpiresAt("")
    setIsAddOpen(false)

    toast({
      title: "Промокод создан",
      description: `Промокод ${newPromo.code} активирован и готов к использованию.`,
    })
  }

  const handleToggleStatus = (id: string) => {
    setPromos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "active" ? "disabled" : "active",
            }
          : p
      )
    )
    toast({
      title: "Статус изменен",
      description: "Статус промокода успешно обновлен.",
    })
  }

  const handleDeletePromo = (id: string, promoCode: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id))
    toast({
      title: "Промокод удален",
      description: `Промокод ${promoCode} удален из системы.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Активных промокодов
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            {promos.filter((p) => p.status === "active").length}
          </div>
          <div className="text-xs text-muted-foreground">
            Действующие акции и скидки магазина
          </div>
        </Card>
        <Card className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Всего использований
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            {totalUsages}
          </div>
          <div className="text-xs text-muted-foreground">
            Заказов оформлено с применением купонов
          </div>
        </Card>
        <Card className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Сумма скидок покупателям
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            1 480 000 ₸
          </div>
          <div className="text-xs text-muted-foreground">
            Общая выгода клиентов за текущий период
          </div>
        </Card>
      </div>

      {/* Promos Table Card */}
      <Card className="rounded-md">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
                Промокоды и акции
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Управление акциями, купонами на скидку и условиями бесплатной доставки
              </CardDescription>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="h-9 gap-2">
                  <Icons.plusCircle className="size-4" />
                  <span>Создать промокод</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleAddPromo}>
                  <DialogHeader>
                    <DialogTitle>Создать новый промокод</DialogTitle>
                    <DialogDescription>
                      Укажите код, размер скидки, условия применения и срок действия.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">Код промокода (латиница)</Label>
                      <Input
                        id="promo-code"
                        placeholder="ENERGY15"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo-discount">Размер скидки (напр. 15% или 3000 ₸)</Label>
                      <Input
                        id="promo-discount"
                        placeholder="15% или 3 000 ₸"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo-desc">Описание условий акции</Label>
                      <Input
                        id="promo-desc"
                        placeholder="Скидка 15% при заказе авторских браслетов от 30 000 ₸"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo-expires">Срок действия</Label>
                      <Input
                        id="promo-expires"
                        placeholder="31.12.2026 или Бессрочно"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button type="submit">Активировать промокод</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search bar */}
          <div className="pt-2">
            <div className="relative max-w-sm">
              <Icons.search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по коду или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Промокод</th>
                    <th className="px-4 py-3">Скидка</th>
                    <th className="px-4 py-3">Условия акции</th>
                    <th className="px-4 py-3 text-center">Применений</th>
                    <th className="px-4 py-3">Срок действия</th>
                    <th className="px-4 py-3">Статус</th>
                    <th className="px-4 py-3 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPromos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-24 text-center text-muted-foreground">
                        Промокоды не найдены.
                      </td>
                    </tr>
                  ) : (
                    filteredPromos.map((promo) => (
                      <tr key={promo.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-semibold font-mono text-base text-primary">
                          {promo.code}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="font-semibold">
                            {promo.discount}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 max-w-sm truncate text-muted-foreground">
                          {promo.description}
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {promo.usageCount}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {promo.expiresAt}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={promo.status === "active" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {promo.status === "active" ? "Активен" : "Приостановлен"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label="Открыть меню"
                              >
                                <Icons.dotsHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleToggleStatus(promo.id)}
                              >
                                {promo.status === "active"
                                  ? "Приостановить"
                                  : "Активировать"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => handleDeletePromo(promo.id, promo.code)}
                              >
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
