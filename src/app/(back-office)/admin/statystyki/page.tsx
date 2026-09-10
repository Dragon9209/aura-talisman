import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"
import { AnalyticsDashboard } from "@/components/shells/analytics-dashboard"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Статистика и аналитика | AURA TALISMAN",
  description: "Финансовые отчеты, аналитика продаж и метрики магазина AURA TALISMAN",
}

export default async function AdminStatsPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user.role !== "administrator")
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Загрузка аналитики...</div>}>
        <AnalyticsDashboard />
      </React.Suspense>
    </div>
  )
}
