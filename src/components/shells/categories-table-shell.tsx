"use client"

import * as React from "react"
import Link from "next/link"
import { deleteCategory } from "@/actions/category"
import { type ColumnDef } from "@tanstack/react-table"

import { type Category } from "@/db/schema"

import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

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

type AwaitedCategory = Pick<
  Category,
  "id" | "name" | "visibility" | "createdAt"
>

interface CategoriesTableShellProps {
  data: AwaitedCategory[]
  pageCount: number
}

export function CategoriesTableShell({
  data,
  pageCount,
}: Readonly<CategoriesTableShellProps>): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  const columns = React.useMemo<ColumnDef<AwaitedCategory, unknown>[]>(
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
        cell: ({ cell }) => {
          const raw = String(cell.getValue())
          const namesMap: Record<string, string> = {
            bransoletki: "Браслеты",
            chetki: "Чётки и Малы",
            naszyjniki: "Чокеры и Колье",
            kolczyki: "Серьги и Кольца",
          }
          return <span className="font-medium">{namesMap[raw] ?? raw}</span>
        },
      },
      {
        accessorKey: "visibility",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Видимость" />
        ),
        cell: ({ cell }) => {
          const vis = String(cell.getValue())
          const isVisible = vis === "widoczna" || vis === "active"
          return (
            <Badge variant={isVisible ? "secondary" : "outline"}>
              {isVisible ? "Отображается" : "Скрыта"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Дата добавления" />
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
                <Link href={`/admin/kategorie/${row.original.id}`}>Редактировать</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      row.toggleSelected(false)

                      const message = await deleteCategory({
                        id: row.original.id,
                      })

                      switch (message) {
                        case "success":
                          toast({
                            title: "Категория удалена",
                          })
                          break
                        default:
                          toast({
                            title: "Не удалось удалить категорию",
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
          deleteCategory({
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
          title: "Выбранные категории удалены",
        })
      } else {
        toast({
          title: "Некоторые категории не были удалены",
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
      searchableColumns={[
        {
          id: "name",
          title: "категориям",
        },
      ]}
      newRowLink={`/admin/kategorie/dodaj-kategorie`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
