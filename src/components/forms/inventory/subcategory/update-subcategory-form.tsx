"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateSubcategory } from "@/actions/category"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Subcategory } from "@/db/schema"
import {
  updateSubcategorySchema,
  type UpdateSubcategoryInput,
} from "@/validations/category"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface UpdateSubcategoryFormProps {
  subcategory: Subcategory
}

export function UpdateSubcategoryForm({
  subcategory,
}: Readonly<UpdateSubcategoryFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateSubcategoryInput>({
    resolver: zodResolver(updateSubcategorySchema),
    defaultValues: {
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description ?? "",
      categoryName: subcategory.categoryName,
    },
  })

  function onSubmit(formData: UpdateSubcategoryInput): void {
    startUpdateTransition(async () => {
      try {
        const message = await updateSubcategory({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          categoryName: formData.categoryName,
        })

        console.log(message)

        switch (message) {
          case "invalid-input":
            toast({
              title: "Неверный формат введенных данных",
              variant: "destructive",
            })
            break
          case "not-found":
            toast({
              title: "Подкатегория не найдена",
              description: "Указанная подкатегория не существует",
              variant: "destructive",
            })
            break
          case "exists":
            toast({
              title: "Для этой категории подкатегория с таким именем уже существует",
              description: "Укажите другое название",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Подкатегория успешно обновлена",
            })
            router.push("/admin/podkategorie")
            break
          default:
            toast({
              title: "Не удалось обновить подкатегорию",
              description: "Попробуйте позже",
              variant: "destructive",
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Произошла ошибка",
          description: "Попробуйте снова",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>ID подкатегории</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={subcategory.id}
              {...form.register("id")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Родительская категория</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={
                subcategory.categoryName === "bransoletki"
                  ? "Браслеты"
                  : subcategory.categoryName === "chetki"
                    ? "Чётки и Малы"
                    : subcategory.categoryName === "naszyjniki"
                      ? "Чокеры и Колье"
                      : subcategory.categoryName === "kolczyki"
                        ? "Серьги и Кольца"
                        : subcategory.categoryName
              }
              {...form.register("categoryName")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Название</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Напр. 108 бусин"
              defaultValue={subcategory.name}
              {...form.register("name")}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.name?.message}
          />
        </FormItem>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Описание</FormLabel>
              <FormControl className="min-h-[120px]">
                <Textarea
                  placeholder="Описание подкатегории (необязательно)"
                  defaultValue={subcategory.description ?? ""}
                  {...field}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
          )}
        />

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
            href="/admin/podkategorie"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
            aria-label="отмена"
          >
            Отмена
          </Link>
        </div>
      </form>
    </Form>
  )
}
