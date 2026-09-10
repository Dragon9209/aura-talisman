"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addSubcategory } from "@/actions/category"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Category } from "@/db/schema"
import {
  addSubcategorySchema,
  type AddSubcategoryInput,
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
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface AddSubcategoryFormProps {
  categories: Category[]
}

export function AddSubcategoryForm({
  categories,
}: Readonly<AddSubcategoryFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddSubcategoryInput>({
    resolver: zodResolver(addSubcategorySchema),
    defaultValues: {
      name: "",
      description: "",
      categoryName: "",
    },
  })

  function onSubmit(formData: AddSubcategoryInput): void {
    startTransition(async () => {
      try {
        const message = await addSubcategory({
          name: formData.name,
          description: formData.description,
          categoryName: formData.categoryName,
        })

        switch (message) {
          case "exists":
            toast({
              title: "Такая подкатегория уже существует",
              description: "Используйте другое название",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Подкатегория успешно добавлена",
            })
            router.push("/admin/podkategorie")
            router.refresh()
            break
          default:
            toast({
              title: "Ошибка при добавлении подкатегории",
              description: "Попробуйте позже",
              variant: "destructive",
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Произошла ошибка",
          description: "Попробуйте позже",
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
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Категория</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value: typeof field.value) =>
                  field.onChange(value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name === "bransoletki"
                          ? "Браслеты"
                          : category.name === "chetki"
                            ? "Чётки и Малы"
                            : category.name === "naszyjniki"
                              ? "Чокеры и Колье"
                              : category.name === "kolczyki"
                                ? "Серьги и Кольца"
                                : category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Напр. Из вулканической лавы" {...field} />
              </FormControl>
              <FormMessage className="sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Описание</FormLabel>

              <FormControl className="min-h-[120px]">
                <Textarea
                  placeholder="Описание подкатегории (необязательно)"
                  {...field}
                />
              </FormControl>
              <FormMessage className="sm:text-sm" />
            </FormItem>
          )}
        />

        <div className=" flex items-center gap-2 pt-2">
          <Button
            disabled={isPending}
            aria-label="Добавить подкатегорию"
            className="w-fit"
          >
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Сохранение...</span>
              </>
            ) : (
              <span>Добавить</span>
            )}
            <span className="sr-only">Добавить подкатегорию</span>
          </Button>

          <Link
            href="/admin/podkategorie"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
          >
            Отмена
          </Link>
        </div>
      </form>
    </Form>
  )
}
