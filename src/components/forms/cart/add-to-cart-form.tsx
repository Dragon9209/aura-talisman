"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addToCart } from "@/actions/cart"
import { MinusIcon, PlusIcon, CheckIcon } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

interface AddToCartFormProps {
  productId: string
}

export function AddToCartForm({
  productId,
}: Readonly<AddToCartFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [quantity, setQuantity] = React.useState<number>(1)
  const [isPending, startTransition] = React.useTransition()
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false)

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSuccess) {
      router.push("/checkout")
      return
    }
    if (quantity < 1) return

    startTransition(async () => {
      try {
        const message = await addToCart({
          productId,
          quantity,
        })

        if (message === "success") {
          setIsSuccess(true)
          toast({
            title: "Изделие добавлено в корзину",
            description: `Количество: ${quantity} шт.`,
          })
          router.refresh()
          setTimeout(() => setIsSuccess(false), 4000)
        } else if (message === "out-of-stock") {
          toast({
            title: "Изделия нет в наличии",
            description: "Это авторское изделие сейчас изготавливается",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Произошла ошибка",
            description: "Пожалуйста, повторите попытку",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("addToCart error:", error)
        toast({
          title: "Произошла ошибка",
          description: "Пожалуйста, повторите попытку",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form className={cn("flex max-w-[320px] items-center gap-3")} onSubmit={handleAddToCart}>
      <div className="flex items-center rounded-lg border bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-r-none hover:bg-muted"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          disabled={isPending || quantity <= 1}
        >
          <MinusIcon className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Уменьшить количество</span>
        </Button>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            if (!isNaN(val) && val >= 1) {
              setQuantity(val)
            }
          }}
          className="h-9 w-12 rounded-none border-0 text-center font-medium [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-l-none hover:bg-muted"
          onClick={() => setQuantity((prev) => prev + 1)}
          disabled={isPending}
        >
          <PlusIcon className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Увеличить количество</span>
        </Button>
      </div>

      <Button
        aria-label="Добавить в корзину"
        type="submit"
        size="default"
        className={cn(
          "flex-1 rounded-full font-medium transition-all shadow-sm",
          isSuccess && "bg-emerald-600 hover:bg-emerald-700 text-white"
        )}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
            <span>Добавление...</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckIcon className="mr-2 size-4" />
            <span>В корзине! Оформить →</span>
          </>
        ) : (
          <>
            <Icons.shoppingCart className="mr-2 size-4" />
            <span>В корзину</span>
          </>
        )}
      </Button>
    </form>
  )
}
