import type { Metadata } from "next"

import { env } from "@/env.mjs"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Koszyk na zakupy",
  description: "Zaloguj się aby zobaczyć zawartość koszyka",
}

import { redirect } from "next/navigation"

export default function CartPage(): JSX.Element {
  redirect("/checkout")
}
