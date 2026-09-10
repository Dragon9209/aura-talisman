import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"

import auth from "@/lib/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DemoLoginButtons } from "@/components/auth/demo-login-buttons"
import { SignInWithPasswordForm } from "@/components/forms/auth/signin-with-password-form"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Вход в аккаунт",
  description: "Войдите в личный кабинет AURA TALISMAN",
}

export default async function SignInPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session) redirect(DEFAULT_SIGNIN_REDIRECT)

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center py-12">
      <Card className="bg-background max-sm:flex max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[400px] sm:max-w-[420px] shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-serif tracking-wide">Вход в аккаунт</CardTitle>
            <Link href="/" title="На главную">
              <Icons.close className="size-4 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
          <CardDescription>
            Личный кабинет AURA TALISMAN и доступ к заказам
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-sm:w-full max-sm:max-w-[340px] max-sm:px-6">
          <DemoLoginButtons />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 font-medium text-muted-foreground">
                или обычный вход по email
              </span>
            </div>
          </div>

          <SignInWithPasswordForm />
        </CardContent>

        <CardFooter className="grid w-full text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-6 border-t pt-4">
          <div className="text-center text-xs text-muted-foreground">
            Тестовые аккаунты работают мгновенно без базы данных.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
