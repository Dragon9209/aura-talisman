import Link from "next/link"
import { getCart } from "@/actions/cart"

import { cn, formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import { Icons } from "@/components/icons"

export async function CartSheet(): Promise<JSX.Element> {
  const cartLineItems = await getCart()

  const itemCount = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )

  const cartTotal = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.price),
    0
  )

  return (
    <Sheet>
      <SheetTrigger asChild className="transition-all duration-300 ease-in-out">
        <Button
          aria-label="Открыть корзину"
          variant="outline"
          size="icon"
          className="relative size-8 shrink-0"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <Icons.shoppingCart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 transition-all duration-300 ease-in-out sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Корзина {itemCount > 0 && `(${itemCount})`}</SheetTitle>
          <Separator />
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <CartLineItems items={cartLineItems} className="" />
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Доставка по Казахстану</span>
                  <span className="font-medium text-emerald-600">Бесплатно</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Подарочный мешочек</span>
                  <span>В подарок</span>
                </div>
                <div className="flex text-base font-semibold">
                  <span className="flex-1">Итого</span>
                  <span>{formatPrice(cartTotal.toFixed(2))}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    aria-label="Перейти к оформлению"
                    href="/checkout"
                    className={buttonVariants({
                      size: "sm",
                      className: "w-full rounded-full py-2.5",
                    })}
                  >
                    Перейти к оформлению
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <Icons.shoppingCart
              className="mb-4 size-16 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-xl font-medium text-muted-foreground">
              Ваша корзина пока пуста
            </p>

            <SheetTrigger asChild>
              <Link
                href="/produkty"
                aria-label="Выбрать изделия в каталоге"
                className={cn(
                  buttonVariants({ variant: "link", size: "sm" }),
                  "text-sm text-muted-foreground"
                )}
              >
                Выбрать браслеты и талисманы
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
