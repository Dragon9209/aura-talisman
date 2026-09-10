"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateUserAsAdmin } from "@/actions/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { users, type User } from "@/db/schema"
import {
  updateUserAsAdminSchema,
  type UpdateUserAsAdminInput,
} from "@/validations/user"

import { useToast } from "@/hooks/use-toast"
import { cn, formatDate } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/icons"

interface UpdateUserAsAdminFormProps {
  user: User
}

export function UpdateUserAsAdminForm({
  user,
}: Readonly<UpdateUserAsAdminFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateUserAsAdminInput>({
    resolver: zodResolver(updateUserAsAdminSchema),
    defaultValues: {
      role: user.role,
    },
  })

  function onSubmit(formData: UpdateUserAsAdminInput): void {
    startUpdateTransition(async () => {
      try {
        const message = await updateUserAsAdmin({
          id: user.id,
          email: user.email,
          role: formData.role,
          createdAt: user.createdAt,
        })

        switch (message) {
          case "success":
            toast({
              title: "Данные пользователя обновлены",
            })
            router.push("/admin/uzytkownicy")
            break
          default:
            toast({
              title: "Произошла ошибка",
              description: "Попробуйте позже",
              variant: "destructive",
            })
            console.error(message)
        }
      } catch (error) {
        toast({
          title: "Произошла ошибка",
          description: "Попробуйте снова",
          variant: "destructive",
        })
        console.error(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="flex w-full flex-col gap-4 md:w-4/5 lg:flex-row xl:w-2/3">
          <FormField
            control={form.control}
            name="id"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>ID пользователя</FormLabel>
                <FormControl>
                  <Input value={user.id} disabled />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user.email} disabled />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col gap-4 md:w-4/5 lg:flex-row xl:w-2/3">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Роль в системе</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                    defaultValue={user.role}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(users.role.enumValues).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === "administrator"
                              ? "Администратор"
                              : option === "klient"
                                ? "Клиент / Покупатель"
                                : option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Дата регистрации</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={formatDate(user.createdAt.toString())}
                    disabled
                  />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            disabled={isUpdating}
            aria-label="сохранить изменения"
            className="w-fit"
          >
            {isUpdating ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Сохранение...</span>
              </>
            ) : (
              <span>Сохранить изменения</span>
            )}
            <span className="sr-only">Сохранить изменения</span>
          </Button>

          <Link
            href="/admin/uzytkownicy"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
            aria-label="отмена"
          >
            Отмена
          </Link>
        </div>
      </form>
    </Form>
  )
}
