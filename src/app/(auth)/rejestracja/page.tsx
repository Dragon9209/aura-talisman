import { type Metadata } from "next"
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
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { SignUpWithPasswordForm } from "@/components/forms/auth/signup-with-password-form"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Создание аккаунта",
  description:
    "Зарегистрируйтесь в нашем магазине для отслеживания заказов и персональных скидок",
}

export default async function SignUpPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session) redirect(DEFAULT_SIGNIN_REDIRECT)

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center md:flex">
      <Card className="max-sm:flex max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-2xl">Создание аккаунта</CardTitle>
            <Link href="/">
              <Icons.close className="size-4" />
            </Link>
          </div>
          <CardDescription>
            Выберите удобный способ регистрации
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
          <OAuthButtons />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
              <span className="bg-background px-3 font-medium tracking-tight">
                Или по паролю
              </span>
            </div>
          </div>
          <SignUpWithPasswordForm />
        </CardContent>
        <CardFooter className="grid w-full gap-4 text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
          <div>
            <div>
              <span>Уже есть аккаунт? </span>
              <Link
                aria-label="Войти"
                href="/logowanie"
                className="font-bold tracking-wide text-primary underline-offset-4 transition-all hover:underline"
              >
                Войти
                <span className="sr-only">Войти</span>
              </Link>
              .
            </div>
          </div>

          <div className="text-sm text-muted-foreground md:text-xs">
            Регистрируясь, вы принимаете нашу <br />
            <Link
              aria-label="Политика конфиденциальности"
              href="/polityka-prywatnosci"
              className="font-semibold underline-offset-4 transition-all hover:underline"
            >
              политику конфиденциальности
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
