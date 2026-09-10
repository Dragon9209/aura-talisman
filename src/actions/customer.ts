"use server"

import { mockCustomers } from "@/data/mock-store-data"

export async function getCustomerById({ id }: { id: string }) {
  const cleanId = id.toLowerCase()
  return (
    mockCustomers.find(
      (c) =>
        c.email.toLowerCase() === cleanId ||
        c.name.toLowerCase().includes(cleanId)
    ) || mockCustomers[0]
  )
}

export async function getCustomerByEmail({ email }: { email: string }) {
  return (
    mockCustomers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    ) || null
  )
}
