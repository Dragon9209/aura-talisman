"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  XCircle,
  ExternalLink,
  ShoppingBag,
} from "lucide-react"

import { formatPrice } from "@/lib/utils"
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface AdminOrder {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  city: string
  address: string
  postalCode: string
  status: "Доставлен" | "В пути" | "В обработке" | "Отменен"
  date: string
  formattedDate: string
  amount: number
  deliveryCost: number
  packaging: string
  paymentMethod: string
  paymentStatus: string
  tracking: {
    carrier: string
    trackingCode: string
    currentStatus: string
    steps: { title: string; time: string; done: boolean }[]
  }
  items: OrderItem[]
}

const initialOrders: AdminOrder[] = [
  {
    id: "ord-kz-8492",
    orderNumber: "#KZ-8492",
    customerName: "Алихан Сейфуллин",
    email: "alikhan.s@gmail.com",
    phone: "+7 (777) 345-67-89",
    city: "Алматы",
    address: "пр. Достык, д. 128, кв. 45",
    postalCode: "050000",
    status: "Доставлен",
    date: "Сегодня, 14:30",
    formattedDate: "09.09.2026 14:30",
    amount: 44000,
    deliveryCost: 1500,
    packaging: "Подарочный бархатный мешочек AURA TALISMAN",
    paymentMethod: "Kaspi Pay / Банковская карта",
    paymentStatus: "Оплачено онлайн",
    tracking: {
      carrier: "СДЭК Экспресс (Алматы)",
      trackingCode: "KZ-CDEK-849271",
      currentStatus: "Заказ успешно доставлен покупателю в руки",
      steps: [
        { title: "Заказ оформлен и подтвержден", time: "Сегодня 11:00", done: true },
        { title: "Упакован в бархатный футляр и передан курьеру", time: "Сегодня 12:45", done: true },
        { title: "Вручен лично покупателю", time: "Сегодня 14:30", done: true },
      ],
    },
    items: [
      {
        id: "prod-1",
        name: "Браслет «Сила Вулкана» (Лава + Агат)",
        quantity: 1,
        price: 18500,
      },
      {
        id: "prod-2",
        name: "Чётки Мала 108 бусин (Рудракша + Лазурит)",
        quantity: 1,
        price: 24000,
      },
    ],
  },
  {
    id: "ord-kz-8491",
    orderNumber: "#KZ-8491",
    customerName: "Данара Касымова",
    email: "danara.k@mail.kz",
    phone: "+7 (701) 890-12-34",
    city: "Астана",
    address: "ул. Достык, д. 18, оф. 302",
    postalCode: "010000",
    status: "В пути",
    date: "Вчера, 11:15",
    formattedDate: "08.09.2026 11:15",
    amount: 24000,
    deliveryCost: 0,
    packaging: "Премиум-футляр AURA TALISMAN",
    paymentMethod: "Kaspi QR",
    paymentStatus: "Оплачено онлайн",
    tracking: {
      carrier: "СДЭК Авиа (Алматы — Астана)",
      trackingCode: "KZ-CDEK-849155",
      currentStatus: "Груз прибыл в сортировочный центр Астаны, передан курьеру",
      steps: [
        { title: "Заказ сформирован на складе", time: "08.09 11:15", done: true },
        { title: "Авиаперелет Алматы — Астана", time: "08.09 21:30", done: true },
        { title: "Выдан курьеру для утренней доставки", time: "Сегодня 09:00", done: false },
      ],
    },
    items: [
      {
        id: "prod-3",
        name: "Браслет изобилия «Тигровый глаз & Пирит»",
        quantity: 1,
        price: 24000,
      },
    ],
  },
  {
    id: "ord-kz-8490",
    orderNumber: "#KZ-8490",
    customerName: "Арман Жумабеков",
    email: "arman.zh@gmail.com",
    phone: "+7 (705) 555-43-21",
    city: "Шымкент",
    address: "пр. Тауке хана, д. 45",
    postalCode: "160000",
    status: "Доставлен",
    date: "06 сен 2026",
    formattedDate: "06.09.2026 16:45",
    amount: 18500,
    deliveryCost: 0,
    packaging: "Подарочный бархатный мешочек AURA TALISMAN",
    paymentMethod: "Оплата картой Visa / Master",
    paymentStatus: "Оплачено онлайн",
    tracking: {
      carrier: "Казпочта Экспресс",
      trackingCode: "KZ-POST-849012",
      currentStatus: "Посылка вручена в отделении Шымкента",
      steps: [
        { title: "Прием в отделении Алматы", time: "06.09 17:00", done: true },
        { title: "Прибытие в Шымкент", time: "07.09 14:00", done: true },
        { title: "Вручено адресату", time: "07.09 16:30", done: true },
      ],
    },
    items: [
      {
        id: "prod-1",
        name: "Браслет «Сила Вулкана» (Лава + Агат)",
        quantity: 1,
        price: 18500,
      },
    ],
  },
  {
    id: "ord-kz-8489",
    orderNumber: "#KZ-8489",
    customerName: "Айгерим Нурланова",
    email: "aigerim.n@bk.ru",
    phone: "+7 (775) 234-56-78",
    city: "Караганда",
    address: "пр. Бухар-Жырау, д. 62",
    postalCode: "100000",
    status: "В обработке",
    date: "05 сен 2026",
    formattedDate: "05.09.2026 09:20",
    amount: 16500,
    deliveryCost: 1200,
    packaging: "Крафтовая эко-упаковка AURA",
    paymentMethod: "Kaspi Gold перевод",
    paymentStatus: "Ожидает подтверждения",
    tracking: {
      carrier: "СДЭК Экспресс",
      trackingCode: "KZ-CDEK-848900",
      currentStatus: "Ожидает передачи курьеру в Караганде",
      steps: [
        { title: "Заказ подтвержден менеджером", time: "05.09 09:30", done: true },
        { title: "Упакован в мастерской", time: "05.09 14:00", done: true },
        { title: "Отправка в филиал Караганды", time: "06.09 10:00", done: false },
      ],
    },
    items: [
      {
        id: "prod-4",
        name: "Чокер-оберег «Малахит & Золотой Амулет»",
        quantity: 1,
        price: 16500,
      },
    ],
  },
]

export function AdminDashboardShell(): JSX.Element {
  const { toast } = useToast()
  const [orders, setOrders] = React.useState<AdminOrder[]>(initialOrders)
  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(
    initialOrders[0]?.id ?? "ord-kz-8492"
  )
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [period, setPeriod] = React.useState<"week" | "month" | "year">("week")
  const [isTrackingOpen, setIsTrackingOpen] = React.useState(false)

  // Current selected order guaranteed non-null
  const activeOrder: AdminOrder =
    orders.find((o) => o.id === selectedOrderId) ??
    orders[0] ??
    initialOrders[0]!

  // Filtered orders
  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "all") return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  // Copy order number to clipboard
  const handleCopyOrderNumber = async (orderNumber: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(orderNumber)
      }
      toast({
        title: "Номер заказа скопирован",
        description: `${orderNumber} сохранен в буфер обмена`,
      })
    } catch {
      toast({
        title: "Номер заказа",
        description: orderNumber,
      })
    }
  }

  // Export orders to CSV
  const handleExportCsv = () => {
    try {
      const headers = [
        "Номер заказа",
        "Покупатель",
        "Email",
        "Телефон",
        "Город",
        "Адрес",
        "Статус",
        "Дата",
        "Сумма (₸)",
      ]
      const rows = filteredOrders.map((o) => [
        o.orderNumber,
        `"${o.customerName}"`,
        o.email,
        `"${o.phone}"`,
        `"${o.city}"`,
        `"${o.address}"`,
        `"${o.status}"`,
        `"${o.formattedDate}"`,
        o.amount,
      ])
      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute(
        "download",
        `aura_talisman_orders_${new Date().toISOString().slice(0, 10)}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Экспорт выполнен успешно",
        description: `Выгружено ${filteredOrders.length} заказов в формате CSV`,
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось сформировать файл выгрузки",
        variant: "destructive",
      })
    }
  }

  // Cancel active order
  const handleCancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Отменен" } : o))
    )
    toast({
      title: "Заказ отменен",
      description: `Статус заказа ${activeOrder.orderNumber} изменен на «Отменен»`,
    })
  }

  // Next / Previous order navigation
  const currentIndex = orders.findIndex((o) => o.id === selectedOrderId)
  const handlePrevOrder = () => {
    if (currentIndex > 0 && orders[currentIndex - 1]) {
      setSelectedOrderId(orders[currentIndex - 1]!.id)
    }
  }
  const handleNextOrder = () => {
    if (currentIndex < orders.length - 1 && orders[currentIndex + 1]) {
      setSelectedOrderId(orders[currentIndex + 1]!.id)
    }
  }

  // Period stats
  const statsConfig = {
    week: {
      sales: "385 000 ₸",
      salesGrowth: "+25% по сравнению с прошлой",
      salesProgress: 75,
      month: "1 450 000 ₸",
      monthGrowth: "+14% к предыдущему месяцу",
      monthProgress: 62,
    },
    month: {
      sales: "1 450 000 ₸",
      salesGrowth: "+18% к целевому показателю",
      salesProgress: 82,
      month: "4 250 000 ₸",
      monthGrowth: "Квартальный объем продаж",
      monthProgress: 68,
    },
    year: {
      sales: "16 850 000 ₸",
      salesGrowth: "+38% по сравнению с прошлым годом",
      salesProgress: 91,
      month: "482 заказа",
      monthGrowth: "Выполнено за 2026 год",
      monthProgress: 88,
    },
  }
  const periodStats = statsConfig[period]

  return (
    <>
      <div className="grid flex-1 items-start gap-4 px-2 py-5 sm:pl-14 sm:pr-6 md:gap-8 lg:grid-cols-3">
        {/* Left 2 Columns */}
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          {/* Top Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-md sm:col-span-2 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Панель заказов AURA TALISMAN</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Оперативный мониторинг продаж, складских остатков и статусов доставки изделий из натуральных минералов по Казахстану.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center gap-3">
                <Button asChild>
                  <Link href="/admin/zamowienia">
                    <ShoppingBag className="mr-2 size-4" />
                    Создать заказ вручную
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/produkty">
                    Управление товарами
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-md shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>
                  {period === "week"
                    ? "За эту неделю"
                    : period === "month"
                    ? "За этот месяц"
                    : "За 2026 год"}
                </CardDescription>
                <CardTitle className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">
                  {periodStats.sales}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {periodStats.salesGrowth}
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={periodStats.salesProgress} aria-label="Прогресс" />
              </CardFooter>
            </Card>

            <Card className="rounded-md shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>
                  {period === "week"
                    ? "За этот месяц"
                    : period === "month"
                    ? "Квартал"
                    : "Всего заказов"}
                </CardDescription>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {periodStats.month}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {periodStats.monthGrowth}
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={periodStats.monthProgress} aria-label="Прогресс" />
              </CardFooter>
            </Card>
          </div>

          {/* Orders Section with Filter & Export */}
          <Tabs
            value={period}
            onValueChange={(val) => setPeriod(val as "week" | "month" | "year")}
            className="w-full"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="week">Неделя</TabsTrigger>
                <TabsTrigger value="month">Месяц</TabsTrigger>
                <TabsTrigger value="year">Год</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-sm"
                    >
                      <ListFilter className="size-3.5" />
                      <span>Фильтр</span>
                      {statusFilter !== "all" && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                          {statusFilter}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Статус заказа</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "all"}
                      onCheckedChange={() => setStatusFilter("all")}
                    >
                      Все заказы
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "Доставлен"}
                      onCheckedChange={() => setStatusFilter("Доставлен")}
                    >
                      Доставлен
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "В пути"}
                      onCheckedChange={() => setStatusFilter("В пути")}
                    >
                      В пути
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "В обработке"}
                      onCheckedChange={() => setStatusFilter("В обработке")}
                    >
                      В обработке
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Export Button */}
                <Button
                  onClick={handleExportCsv}
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-sm"
                >
                  <File className="size-3.5" />
                  <span>Экспорт CSV</span>
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="mt-3">
              <Card className="rounded-md shadow-sm">
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Последние заказы</CardTitle>
                      <CardDescription>
                        Нажмите на строку заказа, чтобы открыть подробную карточку справа.
                      </CardDescription>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/admin/zamowienia" className="text-xs text-primary">
                        Все заказы
                        <ExternalLink className="ml-1 size-3" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Покупатель</TableHead>
                        <TableHead className="hidden sm:table-cell">Город</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="hidden md:table-cell">Дата</TableHead>
                        <TableHead className="text-right">Сумма</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                            Заказов со статусом «{statusFilter}» не найдено
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => {
                          const isSelected = order.id === activeOrder.id
                          return (
                            <TableRow
                              key={order.id}
                              onClick={() => setSelectedOrderId(order.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-accent/80 font-medium"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <TableCell>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="hidden text-xs text-muted-foreground md:inline">
                                  {order.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {order.city}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === "Доставлен"
                                      ? "secondary"
                                      : order.status === "В пути"
                                      ? "outline"
                                      : order.status === "Отменен"
                                      ? "destructive"
                                      : "default"
                                  }
                                  className="text-xs"
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                {order.date}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatPrice(order.amount.toString())}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>

        {/* Right Column: Detailed Order Inspection Card */}
        <div>
          <Card className="overflow-hidden rounded-md shadow-sm">
            <CardHeader className="flex flex-row items-start bg-muted/40 p-4 sm:p-5">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  <span>Заказ: {activeOrder.orderNumber}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 opacity-70 hover:opacity-100"
                    onClick={() => handleCopyOrderNumber(activeOrder.orderNumber)}
                    title="Скопировать номер заказа"
                  >
                    <Copy className="size-3.5" />
                    <span className="sr-only">Скопировать</span>
                  </Button>
                </CardTitle>
                <CardDescription className="text-xs">
                  Оформлен: {activeOrder.date}
                </CardDescription>
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-xs"
                  onClick={() => setIsTrackingOpen(true)}
                >
                  <Truck className="size-3.5" />
                  <span>Трекинг</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="size-8">
                      <MoreVertical className="size-3.5" />
                      <span className="sr-only">Опции</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/zamowienia/${activeOrder.id}`}>
                        Редактировать заказ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.print()}>
                      <Printer className="mr-2 size-4" />
                      Печать накладной
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleCancelOrder(activeOrder.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="mr-2 size-4" />
                      Отменить заказ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-5 text-sm space-y-4">
              {/* Composition */}
              <div>
                <div className="font-semibold mb-2 text-foreground">Состав заказа</div>
                <ul className="grid gap-2 text-xs sm:text-sm">
                  {activeOrder.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between rounded-md p-1.5 hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-muted-foreground">
                        {item.name} <span className="font-semibold text-foreground">x {item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        {formatPrice((item.price * item.quantity).toString())}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Price Calculation */}
              <ul className="grid gap-2 text-xs sm:text-sm">
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Стоимость изделий</span>
                  <span>
                    {formatPrice(
                      activeOrder.items
                        .reduce((sum, it) => sum + it.price * it.quantity, 0)
                        .toString()
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between text-muted-foreground">
                  <span>Доставка ({activeOrder.city})</span>
                  <span>
                    {activeOrder.deliveryCost > 0
                      ? formatPrice(activeOrder.deliveryCost.toString())
                      : "Бесплатно"}
                  </span>
                </li>
                <li className="flex items-center justify-between font-semibold text-base pt-1">
                  <span>Итого к оплате</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {formatPrice(activeOrder.amount.toString())}
                  </span>
                </li>
              </ul>

              <Separator />

              {/* Delivery Address & Packaging */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <div className="font-semibold text-xs text-foreground">Адрес доставки</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground text-xs">
                    <span>г. {activeOrder.city}</span>
                    <span>{activeOrder.address}</span>
                    <span>Индекс: {activeOrder.postalCode}</span>
                  </address>
                </div>
                <div className="grid gap-1.5">
                  <div className="font-semibold text-xs text-foreground">Упаковка</div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    {activeOrder.packaging}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Contact Information */}
              <div className="grid gap-2">
                <div className="font-semibold text-xs text-foreground">Данные покупателя</div>
                <dl className="grid gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Имя:</dt>
                    <dd className="font-medium">{activeOrder.customerName}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd>
                      <a
                        href={`mailto:${activeOrder.email}`}
                        className="text-primary hover:underline"
                      >
                        {activeOrder.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Телефон:</dt>
                    <dd>
                      <a
                        href={`tel:${activeOrder.phone}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {activeOrder.phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <Separator />

              {/* Payment Details */}
              <div className="grid gap-1.5">
                <div className="font-semibold text-xs text-foreground">Оплата</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CreditCard className="size-3.5" />
                    {activeOrder.paymentMethod}
                  </span>
                  <Badge variant="secondary" className="text-[11px] text-emerald-600 bg-emerald-500/10">
                    {activeOrder.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-row items-center border-t bg-muted/30 px-5 py-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Статус:</span>
                <Badge variant="outline" className="text-xs font-semibold">
                  {activeOrder.status}
                </Badge>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="size-7"
                  onClick={handlePrevOrder}
                  disabled={currentIndex <= 0}
                  title="Предыдущий заказ"
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="sr-only">Предыдущий</span>
                </Button>
                <span className="text-xs text-muted-foreground px-1">
                  {currentIndex + 1} из {orders.length}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-7"
                  onClick={handleNextOrder}
                  disabled={currentIndex >= orders.length - 1}
                  title="Следующий заказ"
                >
                  <ChevronRight className="size-3.5" />
                  <span className="sr-only">Следующий</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delivery Tracking Dialog */}
      <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="size-5 text-primary" />
              Трекинг заказа {activeOrder.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Служба доставки: <b>{activeOrder.tracking.carrier}</b> • Трек-код:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                {activeOrder.tracking.trackingCode}
              </code>
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="text-xs font-medium text-muted-foreground">Текущий статус:</div>
              <div className="mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {activeOrder.tracking.currentStatus}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Этапы выполнения
              </div>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                {activeOrder.tracking.steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <span
                      className={`absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full text-[10px] ${
                        step.done
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
                    </span>
                    <div className="space-y-0.5">
                      <p className={`text-sm ${step.done ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyOrderNumber(activeOrder.tracking.trackingCode)}
            >
              <Copy className="mr-1.5 size-3.5" />
              Копировать трек
            </Button>
            <Button size="sm" onClick={() => setIsTrackingOpen(false)}>
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
