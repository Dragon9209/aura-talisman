"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { logoutUser } from "@/actions/auth"

import { DEFAULT_SIGNOUT_REDIRECT } from "@/config/defaults"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SignOutButtonProps {
  buttonStyles?: string
  buttonSize?: string
  iconStyles?: string
}

export function SignOutButton({
  buttonStyles,
  iconStyles,
}: Readonly<SignOutButtonProps>): JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      aria-label="Выйти из аккаунта"
      variant="ghost"
      disabled={isPending}
      className={cn("w-full justify-start text-sm", buttonStyles)}
      onClick={() => {
        startTransition(async () => {
          await logoutUser()
          try {
            await signOut({ redirect: false })
          } catch {}
          window.location.href = DEFAULT_SIGNOUT_REDIRECT
        })
      }}
    >
      <Icons.logout
        className={cn("mr-2 size-4", iconStyles)}
        aria-hidden="true"
      />
      {isPending ? "Выход..." : "Выйти"}
    </Button>
  )
}
