"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateCategory } from "@/actions/category"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { categories, type Category } from "@/db/schema"
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "@/validations/category"

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

interface UpdateCategoryFormProps {
  category: Category
}

export function UpdateCategoryForm({
  category,
}: Readonly<UpdateCategoryFormProps>): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [isUpdating, startUpdateTransition] = React.useTransition()
  const { isUploading, startUpload } = useUploadThing("categoryImage")

  React.useEffect(() => {
    if (category.images && category.images.length > 0) {
      setFiles(
        category.images.map((image) => {
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
  }, [category])

  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      visibility: category.visibility,
      images: category.images ?? [],
    },
  })

  // TODO: Handle image update
  function onSubmit(formData: UpdateCategoryInput): void {
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

        const message = await updateCategory({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          visibility: formData.visibility,
          images: images ?? category.images,
        })

        switch (message) {
          case "invalid-input":
            toast({
              title: "Неверный формат введенных данных",
              variant: "destructive",
            })
            break
          case "not-found":
            toast({
              title: "Категория не найдена",
              description: "Категория с указанным ID не существует",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Категория успешно обновлена",
            })
            router.push("/admin/kategorie")
            break
          default:
            toast({
              title: "Не удалось обновить категорию",
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
          <FormLabel>ID категории</FormLabel>
          <FormControl>
            <Input
              type="text"
              disabled
              defaultValue={category.id}
              {...form.register("id")}
            />
          </FormControl>
        </FormItem>

        <FormItem className="w-full md:w-4/5 xl:w-2/3">
          <FormLabel>Название</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Напр. Браслеты"
              defaultValue={category.name}
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
                  placeholder="Описание категории (необязательно)"
                  defaultValue={category.description ?? ""}
                  {...field}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.description?.message}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Видимость в каталоге</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(categories.visibility.enumValues).map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option === "widoczna"
                              ? "Отображается в каталоге"
                              : option === "ukryta"
                                ? "Скрыта"
                                : option}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage className="sm:text-sm" />
            </FormItem>
          )}
        />

        <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
          <FormLabel>Баннер / Фотография</FormLabel>
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
              maxFiles={1}
              maxSize={1024 * 1024 * 4}
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
            href="/admin/kategorie"
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
