"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { loginAsDemoUser } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

export function DemoLoginButtons(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [loadingRole, setLoadingRole] = React.useState<string | null>(null)

  const handleLogin = async (role: "klient" | "administrator") => {
    try {
      setLoadingRole(role)
      const res = await loginAsDemoUser(role)
      if (res.success) {
        toast({
          title: role === "administrator" ? "Вход администратора" : "Вход покупателя",
          description: role === "administrator" 
            ? "Добро пожаловать в панель управления AURA TALISMAN!" 
            : "Вы успешно вошли в личный кабинет!",
        })
        window.location.href = res.redirect
      }
    } catch (err) {
      toast({
        title: "Ошибка входа",
        description: "Попробуйте ещё раз",
        variant: "destructive",
      })
      setLoadingRole(null)
    }
  }

  return (
    <div className="grid w-full gap-3 pt-1">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
          Быстрый вход в 1 клик (без ввода пароля)
        </p>
      </div>

      <Button
        type="button"
        variant="default"
        className="w-full justify-start gap-2 bg-gradient-to-r from-amber-600 to-amber-700 font-medium text-white hover:from-amber-700 hover:to-amber-800"
        disabled={loadingRole !== null}
        onClick={() => void handleLogin("administrator")}
      >
        {loadingRole === "administrator" ? (
          <Icons.spinner className="size-4 animate-spin" />
        ) : (
          <Icons.dashboard className="size-4" />
        )}
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-semibold leading-none">Войти как Администратор (Владелец)</span>
          <span className="text-[10px] text-amber-100/80">Полный доступ к панели /admin, заказам и товарам</span>
        </div>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2 border-primary/30 hover:bg-accent"
        disabled={loadingRole !== null}
        onClick={() => void handleLogin("klient")}
      >
        {loadingRole === "klient" ? (
          <Icons.spinner className="size-4 animate-spin" />
        ) : (
          <Icons.user className="size-4" />
        )}
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-semibold leading-none">Войти как Покупатель (Клиент)</span>
          <span className="text-[10px] text-muted-foreground">Доступ к корзине, заказам и избранному</span>
        </div>
      </Button>
    </div>
  )
}
