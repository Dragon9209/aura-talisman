"use client"

import * as React from "react"
import Link from "next/link"
import type { NavItem } from "@/types"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

import { NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { MainNavItem } from "@/components/nav/store-front/main-nav-item"
import { TalismanLogo } from "@/components/brand/talisman-logo"

interface MainNavProps {
  items: NavItem[]
}

export function MainNav({ items }: Readonly<MainNavProps>): JSX.Element {
  return (
    <div className="hidden w-full items-center gap-10 bg-background lg:flex">
      <TalismanLogo className="mr-2" />

      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {items.map((item) =>
            item?.subItems ? (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className="h-auto font-serif text-[18px] font-normal tracking-[0.02em] text-zinc-800 dark:text-zinc-200 hover:text-amber-800 dark:hover:text-amber-400 focus:text-amber-800 data-[state=open]:text-amber-800 transition-colors py-2 px-3.5">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.subItems.map((subItem) => (
                      <MainNavItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.href}
                      >
                        {subItem.description}
                      </MainNavItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={item.title}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-auto font-serif text-[18px] font-normal tracking-[0.02em] text-zinc-800 dark:text-zinc-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors py-2 px-3.5"
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          )}

          {/* Last item (About us) */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-auto font-serif text-[18px] font-normal tracking-[0.02em] text-zinc-800 dark:text-zinc-200 hover:text-amber-800 dark:hover:text-amber-400 focus:text-amber-800 data-[state=open]:text-amber-800 transition-colors py-2 px-3.5">
              О бренде
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {siteConfig.name}
                      </div>
                      <p className="text-xs leading-tight text-muted-foreground">
                        <Balancer>{siteConfig.description}</Balancer>
                      </p>
                      <span className="sr-only">Главная</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <MainNavItem title="О мастере" href="/">
                  {
                    "История создания авторских талисманов и философия ручной работы"
                  }
                </MainNavItem>

                <MainNavItem title="Энергия минералов" href="/">
                  {
                    "Как лавовый камень, агат и минералы влияют на внутреннее состояние"
                  }
                </MainNavItem>

                <MainNavItem title="Гид по камням" href="/">
                  {
                    "Подбор талисманов по дате рождения и знакам зодиака"
                  }
                </MainNavItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
