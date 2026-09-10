import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/actions/product"

import { env } from "@/env.mjs"

import { formatPrice } from "@/lib/utils"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { AddToCartForm } from "@/components/forms/cart/add-to-cart-form"
import { ProductImageCarousel } from "@/components/store-front/product-image-carousel"

// TODO: Replace productId with productName in the meta description
interface ProductPageProps {
  params: {
    productId: string
  }
}

export function generateMetadata({
  params,
}: Readonly<ProductPageProps>): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: params.productId,
    description: `Подробное описание и фотографии авторского изделия ${params.productId}`,
  }
}

export default async function ProductPage({
  params,
}: Readonly<ProductPageProps>): Promise<JSX.Element> {
  const productId = decodeURIComponent(params.productId)

  const product = await getProductById({ id: productId })
  if (!product) notFound()

  return (
    <div className="pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          images={product.images ?? []}
          options={{ loop: true }}
          className="w-full md:w-1/2"
        />

        <Separator className="mt-4 md:hidden" />

        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="text-xl font-medium text-amber-700 dark:text-amber-400">
              {formatPrice(product.price)}
            </p>
          </div>

          <Separator className="my-1.5" />
          <AddToCartForm productId={product.id} />
          <Separator className="mt-5" />

          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["description", "specs"]}
          >
            <AccordionItem value="description">
              <AccordionTrigger className="text-base font-semibold">
                Энергетика и свойства минералов
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                <p>{product.description}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specs">
              <AccordionTrigger className="text-base font-semibold">
                Характеристики изделия
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                {product.stone && (
                  <div className="flex justify-between border-b pb-1">
                    <span>Натуральные камни:</span>
                    <span className="font-medium text-foreground">{product.stone}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex justify-between border-b pb-1">
                    <span>Основа / фурнитура:</span>
                    <span className="font-medium text-foreground">{product.material}</span>
                  </div>
                )}
                {product.stoneSize && Number(product.stoneSize) > 0 && (
                  <div className="flex justify-between border-b pb-1">
                    <span>Диаметр бусин:</span>
                    <span className="font-medium text-foreground">{product.stoneSize} мм</span>
                  </div>
                )}
                {product.length && Number(product.length) > 0 && (
                  <div className="flex justify-between border-b pb-1">
                    <span>Обхват / длина:</span>
                    <span className="font-medium text-foreground">{product.length} см</span>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger className="text-base font-semibold">
                Доставка и упаковка
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                <p>
                  Бесплатная курьерская доставка по Казахстану (Алматы, Астана, Шымкент и др.). Каждое изделие заряжается и упаковывается в фирменный бархатный мешочек для бережного хранения.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>
    </div>
  )
}
