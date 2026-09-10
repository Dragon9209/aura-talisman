"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addProduct } from "@/actions/product"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { products, type Category, type Subcategory } from "@/db/schema/index"
import { addProductSchema, type AddProductInput } from "@/validations/product"

import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/hooks/use-uploadthing"
import { cn, isArrayOfFile } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
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
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { Zoom } from "@/components/image-zoom"

interface AddProductFormProps {
  categories: Category[]
  subcategories: Subcategory[]
}

export function AddProductForm({
  categories,
  subcategories,
}: Readonly<AddProductFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const { isUploading, startUpload } = useUploadThing("categoryImage")
  const [isPending, startTransition] = React.useTransition()
  const [filteredSubcategories, setFilteredSubcategories] = React.useState<
    Subcategory[]
  >([])

  const form = useForm<AddProductInput>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      state: "roboczy",
      importance: "standardowy",
      price: "",
      inventory: NaN,
      images: [],
    },
  })

  function onSubmit(formData: AddProductInput): void {
    startTransition(async () => {
      try {
        let message = null

        if (isArrayOfFile(formData.images)) {
          const uploadResults = await startUpload(formData.images)
          const formattedImages =
            uploadResults?.map((image) => ({
              id: image.key,
              name: image.key.split("_")[1] ?? image.key,
              url: image.url,
            })) ?? null

          message = await addProduct({
            name: formData.name,
            description: formData.description,
            state: formData.state,
            importance: formData.importance,
            categoryName: formData.categoryName,
            subcategoryName: formData.subcategoryName,
            price: formData.price,
            inventory: formData.inventory,
            images: formattedImages,
          })
        } else {
          message = await addProduct({
            name: formData.name,
            description: formData.description,
            state: formData.state,
            importance: formData.importance,
            categoryName: formData.categoryName,
            subcategoryName: formData.subcategoryName,
            price: formData.price,
            inventory: formData.inventory,
            images: null,
          })
        }

        switch (message) {
          case "exists":
            toast({
              title: "Товар с таким названием уже существует",
              description: "Используйте другое название",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Товар успешно добавлен",
            })
            router.push("/admin/produkty")
            router.refresh()
            break
          default:
            toast({
              title: "Ошибка при добавлении товара",
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
        className="grid w-full max-w-2xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Напр. Браслет «Сила Вулкана»" {...field} />
              </FormControl>
              <FormMessage />
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
                  placeholder="Описание изделия (необязательно)"
                  {...field}
                />
              </FormControl>
              <FormMessage className="sm:text-sm" />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full md:w-4/5 xl:w-2/3">
                <FormLabel>Статус</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                    disabled={categories && categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "Выберите статус"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(products.state.enumValues).map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {option === "aktywny"
                                ? "Активен"
                                : option === "roboczy"
                                  ? "Черновик"
                                  : (option as string) === "zarchiwizowany" || (option as string) === "archiwalny"
                                    ? "В архиве"
                                    : option}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <UncontrolledFormMessage>
                  {form.formState.errors.importance?.message}
                </UncontrolledFormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="importance"
            render={({ field }) => (
              <FormItem className="w-full md:w-4/5 xl:w-2/3">
                <FormLabel>Приоритет</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                    disabled={categories && categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "Выберите приоритет"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(products.importance.enumValues).map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {option === "standardowy"
                                ? "Стандартный"
                                : option === "wyróżniony"
                                  ? "Популярный (Хит)"
                                  : option === "bestseller"
                                    ? "Бестселлер"
                                    : option}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <UncontrolledFormMessage>
                  {form.formState.errors.state?.message}
                </UncontrolledFormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="categoryName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Категория</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) => {
                      const filteredSubcategories = subcategories.filter(
                        (subcategory) => subcategory.categoryName === value
                      )
                      field.onChange(value)
                      setFilteredSubcategories(filteredSubcategories)
                      form.setValue("subcategoryName", "")
                    }}
                    disabled={categories?.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "Выберите категорию"}
                      />
                    </SelectTrigger>
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
                </FormControl>

                <UncontrolledFormMessage>
                  {form.formState.errors.categoryName?.message}
                </UncontrolledFormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Подкатегория</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                    disabled={filteredSubcategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "Выберите подкатегорию"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {filteredSubcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory.id}
                            value={subcategory.name}
                          >
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <UncontrolledFormMessage>
                  {form.formState.errors.subcategoryName?.message}
                </UncontrolledFormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Цена (₸)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Напр. 18500"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Количество на складе (шт.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Остаток на складе"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* IMAGES */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
              <FormLabel>Фотографии изделия</FormLabel>
              {files?.length ? (
                <div className="flex items-center gap-2">
                  {files.map((file, i) => (
                    <Zoom key={i}>
                      <Image
                        src={file.preview}
                        alt={file.name}
                        className="size-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  ))}
                </div>
              ) : null}
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="images"
                  maxFiles={5}
                  maxSize={2 * 1024 * 1024}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isPending}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.images?.message}
              />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button className="w-fit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span aria-hidden="true">Добавление...</span>
              </>
            ) : (
              <span>Добавить</span>
            )}

            <span className="sr-only">Добавить товар</span>
          </Button>

          <Link
            href="/admin/produkty"
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
