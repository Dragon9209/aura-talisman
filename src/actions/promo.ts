"use server"

import { mockPromos, type PromoCode } from "@/data/mock-store-data"

export type { PromoCode }

export async function getPromoById(rawInput?: { id: string }): Promise<PromoCode | null> {
  if (!rawInput?.id) return mockPromos[0]
  return (
    mockPromos.find(
      (p) =>
        p.id === rawInput.id ||
        p.code.toLowerCase() === rawInput.id.toLowerCase()
    ) || mockPromos[0]
  )
}

export async function getAllPromos(): Promise<PromoCode[]> {
  return mockPromos
}
