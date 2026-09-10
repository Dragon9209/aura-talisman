"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addCategory } from "@/actions/category"
import type { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { categories } from "@/db/schema"
import {
  addCategorySchema,
  type AddCategoryInput,
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

export function AddCategoryForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const { isUploading, startUpload } = useUploadThing("categoryImage")

  const form = useForm<AddCategoryInput>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: categories.visibility.enumValues[0],
      images: [],
    },
  })

  function onSubmit(formData: AddCategoryInput): void {
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

          message = await addCategory({
            name: formData.name,
            description: formData.description,
            visibility: formData.visibility,
            images: formattedImages,
          })
        } else {
          message = await addCategory({
            name: formData.name,
            description: formData.description,
            visibility: formData.visibility,
            images: null,
          })
        }

        switch (message) {
          case "exists":
            toast({
              title: "Такая категория уже существует",
              description: "Используйте другое название",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Категория успешно добавлена",
            })
            router.push("/admin/kategorie")
            router.refresh()
            break
          default:
            toast({
              title: "Ошибка при добавлении категории",
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5 xl:w-2/3">
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Напр. Браслеты" {...field} />
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
                  placeholder="Описание категории (необязательно)"
                  {...field}
                />
              </FormControl>
              <FormMessage className="sm:text-sm" />
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
                    <SelectValue placeholder={field.value === "widoczna" ? "Отображается" : "Скрыта"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(categories.visibility.enumValues).map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option === "widoczna" ? "Отображается" : "Скрыта"}
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

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
              <FormLabel>Изображение</FormLabel>
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

        <div className=" flex items-center gap-2 pt-2">
          <Button
            disabled={isPending}
            aria-label="Добавить категорию"
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
            <span className="sr-only">Добавить категорию</span>
          </Button>

          <Link
            href="/admin/kategorie"
            className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
          >
            Отмена
          </Link>
        </div>
      </form>
    </Form>
  )
}
