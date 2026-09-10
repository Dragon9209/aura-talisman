import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import auth from "@/lib/auth"
import { AdminDashboardShell } from "@/components/shells/admin-dashboard-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Панель управления | AURA TALISMAN",
  description: "Оперативный мониторинг заказов, продаж и логистики интернет-магазина",
}

export default async function AdminPanelPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return <AdminDashboardShell />
}
