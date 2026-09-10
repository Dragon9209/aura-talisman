"use client"

import * as React from "react"
import Link from "next/link"
import { deleteUserAsAdmin } from "@/actions/user"
import { type ColumnDef } from "@tanstack/react-table"

import { products, users, type User } from "@/db/schema"

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

type AwaitedRegisteredUser = Pick<User, "id" | "email" | "role" | "createdAt">

interface RegisteredUsersTableShellProps {
  data: AwaitedRegisteredUser[]
  pageCount: number
}

export function RegisteredUsersTableShell({
  data,
  pageCount,
}: Readonly<RegisteredUsersTableShellProps>): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  const columns = React.useMemo<ColumnDef<AwaitedRegisteredUser, unknown>[]>(
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
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Роль" />
        ),
        cell: ({ cell }) => {
          const role = String(cell.getValue())
          const isAdmin = role === "administrator"
          return (
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Администратор" : "Покупатель"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Дата регистрации" />
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
                <Link href={`/admin/uzytkownicy/${row.original.id}`}>
                  Редактировать
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      row.toggleSelected(false)

                      const message = await deleteUserAsAdmin({
                        id: row.original.id,
                      })

                      switch (message) {
                        case "success":
                          toast({
                            title: "Пользователь удален",
                          })
                          break
                        default:
                          toast({
                            title: "Не удалось удалить пользователя",
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
          deleteUserAsAdmin({
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
          title: "Выбранные пользователи удалены",
        })
      } else {
        toast({
          title: "Некоторые пользователи не были удалены",
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
          id: "email",
          title: "email",
        },
      ]}
      newRowLink={`/admin/uzytkownicy/dodaj-uzytkownika`}
      deleteRowsAction={() => void deleteSelectedRows()}
    />
  )
}
