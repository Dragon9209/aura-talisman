import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import auth from "@/lib/auth"
import { AdminSettingsForm } from "@/components/shells/admin-settings-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Настройки магазина | AURA TALISMAN",
  description: "Управление основными параметрами витрины, валютой и доставкой",
}

export default async function AdminSettingsPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <AdminSettingsForm />
    </div>
  )
}
