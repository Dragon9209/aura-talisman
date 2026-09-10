"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import type { NavItem } from "@/types"

import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface SidebarProps {
  navItems: NavItem[]
}

export function Sidebar({ navItems }: Readonly<SidebarProps>): JSX.Element {
  const segment = useSelectedLayoutSegment()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider delayDuration={150}>
        <nav className="flex flex-col items-center gap-3 px-2 sm:py-[18px]">
          {navItems?.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons]
            const isActive =
              segment === null
                ? item.href === "/admin"
                : Boolean(
                    item.slug &&
                      (item.slug === segment || item.slug.startsWith(String(segment)))
                  )

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    aria-label={item.title}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg text-muted-foreground md:size-8",
                      "transition-colors hover:bg-accent hover:text-foreground",
                      isActive && "bg-accent text-accent-foreground font-semibold"
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="sr-only">{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-3 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin/ustawienia"
                aria-label="Настройки магазина"
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:size-8",
                  segment === "ustawienia" && "bg-accent text-accent-foreground"
                )}
              >
                <Icons.settings className="size-5" />
                <span className="sr-only">Настройки магазина</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Настройки магазина</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  )
}
