"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { addToCart, deleteCartItem } from "@/actions/cart"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"

import type { Product } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"
import { cn, formatPrice } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { PlaceholderImage } from "@/components/placeholder-image"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  variant?: "default" | "switchable"
  isAddedToCart?: boolean
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  className,
  ...props
}: Readonly<ProductCardProps>): JSX.Element {
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  return (
    <Card
      className={cn(
        "size-full overflow-hidden rounded-md transition-all duration-200 ease-in-out hover:bg-accent/30",
        className
      )}
      {...props}
    >
      <Link href={`/produkty/${product.id}`} aria-label={product.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.images?.length ? (
              <Image
                src={
                  product.images[0]?.url ?? "/images/product-placeholder.webp"
                }
                alt={product.images[0]?.name ?? product.name}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
      </Link>
      <Link href={`/produkty/${product.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1 font-serif text-base font-semibold">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-1 font-medium text-amber-700 dark:text-amber-400">
            {formatPrice(product.price)}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="w-full p-4 pt-1">
        {variant === "default" ? (
          <div className="flex w-full items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              aria-label="В корзину"
              className="h-8 w-full rounded-full font-medium transition-all duration-200 ease-in-out hover:bg-accent"
              onClick={() => {
                startTransition(async () => {
                  try {
                    const message = await addToCart({
                      productId: product.id,
                      quantity: 1,
                    })

                    switch (message) {
                      case "success":
                        toast({
                          title: "Изделие добавлено в корзину",
                        })
                        break
                      case "out-of-stock":
                        toast({
                          title: "Изделия нет в наличии",
                          description:
                            "Это авторское изделие сейчас изготавливается",
                          variant: "destructive",
                        })
                        break
                      default:
                        toast({
                          title: "Произошла ошибка",
                          description:
                            "Пожалуйста, повторите попытку",
                          variant: "destructive",
                        })
                    }
                  } catch (error) {
                    console.error(error)
                    toast({
                      title: "Произошла ошибка",
                      description: "Пожалуйста, повторите попытку",
                      variant: "destructive",
                    })
                  }
                })
              }}
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              В корзину
            </Button>

            <div className="flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="В избранное"
                className="size-8 shrink-0 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsFavorite(!isFavorite)
                  toast({
                    title: !isFavorite ? "Добавлено в избранное" : "Удалено из избранного",
                    description: !isFavorite ? `${product.name} в вашем списке желаний` : undefined,
                  })
                }}
              >
                <Icons.heart
                  className={cn("size-3.5 transition-colors", isFavorite ? "fill-rose-500 text-rose-500" : "")}
                  aria-hidden="true"
                />
                <span className="sr-only">В избранное</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                aria-label="Поделиться"
                className="size-8 shrink-0 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (typeof window !== "undefined") {
                    const url = `${window.location.origin}/produkty/${product.id}`
                    navigator.clipboard?.writeText(url)
                    toast({
                      title: "Ссылка скопирована",
                      description: "Можете поделиться изделием с друзьями",
                    })
                  }
                }}
              >
                <Icons.share className="size-3.5" aria-hidden="true" />
                <span className="sr-only">
                  Поделиться
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? "Удалить из корзины" : "В корзину"}
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={() =>
              startTransition(async () => {
                try {
                  const message = await deleteCartItem({
                    productId: product.id,
                  })

                  switch (message) {
                    case "success":
                      toast({
                        title: "Изделие удалено из корзины",
                      })
                      break
                    default:
                      toast({
                        title: "Произошла ошибка",
                        description:
                          "Пожалуйста, повторите попытку",
                        variant: "destructive",
                      })
                  }
                } catch (error) {
                  console.error(error)
                  toast({
                    title: "Произошла ошибка",
                    description: "Пожалуйста, повторите попытку",
                    variant: "destructive",
                  })
                }
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : isAddedToCart ? (
              <Icons.check className="mr-2 size-4" aria-hidden="true" />
            ) : (
              <Icons.plus className="mr-2 size-4" aria-hidden="true" />
            )}
            {isAddedToCart ? "В корзине" : "В корзину"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
