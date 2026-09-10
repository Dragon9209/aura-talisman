"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addUserAsAdmin } from "@/actions/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { users } from "@/db/schema"
import {
  addUserAsAdminSchema,
  type AddUserAsAdminInput,
} from "@/validations/user"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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
import { PasswordInput } from "@/components/password-input"

export function AddUserAsAdminForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddUserAsAdminInput>({
    resolver: zodResolver(addUserAsAdminSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(formData: AddUserAsAdminInput): void {
    startTransition(async () => {
      try {
        const message = await addUserAsAdmin({
          name: formData.name,
          surname: formData.surname,
          role: formData.role,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })

        switch (message) {
          case "exists":
            toast({
              title: "Пользователь с таким email уже существует",
              description: "Укажите другой адрес электронной почты",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Пользователь успешно добавлен",
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
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="flex w-full flex-col gap-4 md:w-4/5 lg:flex-row xl:w-2/3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@auratalisman.kz" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Роль</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Выберите роль"
                        defaultValue={users.role.enumValues[0]}
                      />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col gap-4 md:w-4/5 lg:flex-row xl:w-2/3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="**********" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Подтвердите пароль</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="**********" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            disabled={isPending}
            aria-label="добавить пользователя"
            className="w-fit"
          >
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Добавление...</span>
              </>
            ) : (
              <span>Добавить</span>
            )}
            <span className="sr-only">Добавить пользователя</span>
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
