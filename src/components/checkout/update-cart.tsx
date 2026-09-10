"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { deleteCartItem, updateCartItem } from "@/actions/cart"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"

import type { CartLineItem } from "@/validations/cart"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UpdateCartProps {
  cartLineItem: CartLineItem
}

export function UpdateCart({
  cartLineItem,
}: Readonly<UpdateCartProps>): JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const handleUpdate = (newQuantity: number) => {
    startTransition(async () => {
      try {
        if (newQuantity <= 0) {
          await deleteCartItem({ productId: cartLineItem.id })
        } else {
          await updateCartItem({
            productId: cartLineItem.id,
            quantity: newQuantity,
          })
        }
        router.refresh()
      } catch (error) {
        console.error("Cart update error:", error)
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCartItem({ productId: cartLineItem.id })
        router.refresh()
      } catch (error) {
        console.error("Cart delete error:", error)
      }
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center rounded-md border bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 rounded-r-none hover:bg-muted"
          disabled={isPending}
          onClick={() => handleUpdate(cartLineItem.quantity - 1)}
          aria-label="Уменьшить количество"
        >
          <MinusIcon className="size-3" />
        </Button>
        <span className="w-6 text-center text-xs font-semibold">
          {isPending ? (
            <Icons.spinner className="mx-auto size-3 animate-spin" />
          ) : (
            cartLineItem.quantity
          )}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 rounded-l-none hover:bg-muted"
          disabled={isPending}
          onClick={() => handleUpdate(cartLineItem.quantity + 1)}
          aria-label="Увеличить количество"
        >
          <PlusIcon className="size-3" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={handleDelete}
        aria-label="Удалить из корзины"
      >
        <Trash2Icon className="size-3.5" />
      </Button>
    </div>
  )
}
