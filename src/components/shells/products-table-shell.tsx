"use client"

import * as React from "react"
import Link from "next/link"
import { deleteProduct } from "@/actions/product"
import { type ColumnDef } from "@tanstack/react-table"

import { products, type Product } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"
import { formatDate, formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Icons } from "@/components/icons"

type AwaitedProduct = Pick<
  Product,
  | "id"
  | "name"
  | "state"
  | "importance"
  | "categoryName"
  | "subcategoryName"
  | "price"
  | "inventory"
  | "createdAt"
  | "updatedAt"
>

interface ProductsTableShellProps {
  data: AwaitedProduct[]
  pageCount: number
}

export function ProductsTableShell({
  data,
  pageCount,
}: Readonly<ProductsTableShellProps>) {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  const columns = React.useMemo<ColumnDef<AwaitedProduct, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds((prev) =>
                prev.length === data.length ? [] : data.map((row) => row.id)
              )
            }}
            aria-label="Выбрать все"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id)
              )
            }}
            aria-label="Выбрать строку"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Название" />
        ),
      },
      {
        accessorKey: "state",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Статус" />
        ),
        cell: ({ cell }) => {
          const state = cell.getValue() as Product["state"]
          const stateLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
            aktywny: { label: "Активен", variant: "default" },
            roboczy: { label: "Черновик", variant: "secondary" },
            zarchiwizowany: { label: "В архиве", variant: "outline" },
          }
          const item = stateLabels[state] ?? { label: state, variant: "secondary" }
          return (
            <Badge variant={item.variant}>
              {item.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: "importance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Приоритет" />
        ),
        cell: ({ cell }) => {
          const importance = cell.getValue() as Product["importance"]
          const isFeatured = importance === "wyróżniony"
          return (
            <Badge variant={isFeatured ? "default" : "outline"}>
              {isFeatured ? "В топе" : "Обычный"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "categoryName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Категория" />
        ),
        cell: ({ cell }) => {
          const raw = String(cell.getValue())
          const catMap: Record<string, string> = {
            bransoletki: "Браслеты",
            chetki: "Чётки и Малы",
            naszyjniki: "Чокеры и Колье",
            kolczyki: "Серьги и Кольца",
          }
          return <span>{catMap[raw] ?? raw}</span>
        },
      },
      {
        accessorKey: "subcategoryName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Подкатегория" />
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Цена" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "inventory",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Остаток" />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Дата создания" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Открыть меню"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Icons.dotsHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/admin/produkty/${row.original.id}`}>Редактировать</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      row.toggleSelected(false)

                      const message = await deleteProduct({
                        id: row.original.id,
                      })

                      switch (message) {
                        case "success":
                          toast({
                            title: "Товар удален",
                          })
                          break
                        default:
                          toast({
                            title: "Не удалось удалить товар",
                            description: "Попробуйте позже",
                            variant: "destructive",
                          })
                      }
                    } catch (error) {
                      console.error(error)
                      toast({
                        title: "Ошибка при удалении",
                        description: "Попробуйте позже",
                        variant: "destructive",
                      })
                    }
                  })
                }}
                disabled={isPending}
              >
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [data, isPending, toast]
  )

  function deleteSelectedRows() {
    startTransition(async () => {
      const messages = await Promise.all(
        selectedRowIds.map((id) =>
          deleteProduct({
            id,
          }).catch((error) => {
            console.error(error)
            return "error"
          })
        )
      )

      const allSucceeded = messages.every((message) => message === "success")

      if (allSucceeded) {
        toast({
          title: "Выбранные товары удалены",
        })
      } else {
        toast({
          title: "Некоторые товары не были удалены",
          description: "Попробуйте позже",
          variant: "destructive",
        })
      }

      try {
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
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      // filterableColumns={[
      //   {
      //     id: "category",
      //     title: "Category",
      //     options: products.category.enumValues.map((category) => ({
      //       label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
      //       value: category,
      //     })),
      //   },
      // ]}
      searchableColumns={[
        {
          id: "name",
          title: "товарам",
        },
      ]}
      newRowLink={`/admin/produkty/dodaj-produkt`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
