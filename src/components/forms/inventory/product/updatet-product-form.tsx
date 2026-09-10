"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateProduct } from "@/actions/product"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  products,
  type Category,
  type Product,
  type Subcategory,
} from "@/db/schema"
import {
  updateProductSchema,
  type UpdateProductInput,
} from "@/validations/product"

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

interface UpdateProductFormProps {
  product: Product
  categories: Category[]
  subcategories: Subcategory[]
}

export function UpdateProductForm({
  product,
  categories,
  subcategories,
}: Readonly<UpdateProductFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

  const [filteredSubcategories, setFilteredSubcategories] = React.useState<
    Subcategory[]
  >(() => {
    return subcategories.filter(
      (subcategory) => subcategory.categoryName === product.categoryName
    )
  })

  const [isUpdating, startUpdateTransition] = React.useTransition()
  const { isUploading, startUpload } = useUploadThing("productImage")

  React.useEffect(() => {
    if (product.images && product.images.length > 0) {
      setFiles(
        product.images.map((image) => {
          const file = new File([], image.name, {
            type: "image",
          })

          const fileWithPreview = Object.assign(file, {
            preview: image.url,
          })

          return fileWithPreview
        })
      )
    }
  }, [product])

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      state: product.state,
      importance: product.importance,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      price: product.price,
      inventory: product.inventory,
      images: product.images,
    },
  })

  // TODO: Handle image update
  function onSubmit(formData: UpdateProductInput): void {
    startUpdateTransition(async () => {
      try {
        const images = isArrayOfFile(formData.images)
          ? await startUpload(formData.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.url,
              }))
              return formattedImages ?? null
            })
          : null

        const message = await updateProduct({
          id: product.id,
          name: formData.name,
          description: formData.description,
          state: formData.state,
          importance: formData.importance,
          categoryName: formData.categoryName,
          subcategoryName: formData.subcategoryName,
          price: formData.price,
          inventory: formData.inventory,
          images: images ?? product.images,
        })

        switch (message) {
          case "success":
            toast({
              title: "Товар успешно обновлен",
            })
            setFiles(null)
            router.push("/admin/produkty")
            break
          case "not-found":
            toast({
              title: "Товар не найден",
              description: "Товар с указанным ID не существует",
              variant: "destructive",
            })
            break
          case "invalid-input":
            toast({
              title: "Неверный формат введенных данных",
              variant: "destructive",
            })
            break
          default:
            toast({
              title: "Не удалось обновить товар",
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
          <FormLabel>ID товара</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={product.id}
              {...form.register("id")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Название</FormLabel>
          <FormControl>
            <Input
              aria-invalid={!!form.formState.errors.name}
              placeholder="Название изделия"
              defaultValue={product.name}
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
                  placeholder="Описание изделия (необязательно)"
                  defaultValue={product.description ?? ""}
                  {...field}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row md:w-4/5 xl:w-2/3">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full md:w-4/5 xl:w-2/3">
                <FormLabel>Статус наличия</FormLabel>
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
                  {form.formState.errors.state?.message}
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
                  {form.formState.errors.importance?.message}
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
          <FormItem className="w-full">
            <FormLabel>Цена (₸)</FormLabel>
            <FormControl>
              <Input
                placeholder="Например, 18500"
                defaultValue={product.price}
                {...form.register("price")}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.price?.message}
            />
          </FormItem>

          <FormItem className="w-full">
            <FormLabel>Количество на складе (шт.)</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Остаток на складе"
                {...form.register("inventory", {
                  valueAsNumber: true,
                })}
                defaultValue={product.inventory}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.inventory?.message}
            />
          </FormItem>
        </div>

        <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
          <FormLabel>Фотографии изделия</FormLabel>
          {files?.length ? (
            <div className="flex items-center gap-2">
              {files.map((file, i) => {
                return (
                  <Zoom key={i}>
                    <Image
                      src={file.preview}
                      alt={file.name}
                      className="size-20 shrink-0 rounded-md object-cover object-center"
                      width={80}
                      height={80}
                    />
                  </Zoom>
                )
              })}
            </div>
          ) : null}
          <FormControl>
            <FileDialog
              setValue={form.setValue}
              name="images"
              maxFiles={5}
              maxSize={1024 * 1024 * 2}
              files={files}
              setFiles={setFiles}
              isUploading={isUploading}
              disabled={isUpdating}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.images?.message}
          />
        </FormItem>

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
