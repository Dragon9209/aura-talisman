"use client"

import * as React from "react"
import Link from "next/link"
import type { StripePaymentStatus } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"

import { type Order } from "@/db/schema"

import {
  getStripePaymentStatusColor,
  stripePaymentStatuses,
} from "@/lib/checkout"
import { cn, formatDate, formatId, formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Icons } from "@/components/icons"

type AwaitedOrder = Pick<Order, "id" | "quantity" | "amount" | "createdAt"> & {
  customer: string | null
  status: string
  paymentIntentId: string
}

interface OrdersTableShellProps {
  data: AwaitedOrder[]
  pageCount: number
  isSearchable?: boolean
}

export function OrdersTableShell({
  data,
  pageCount,
  isSearchable = true,
}: Readonly<OrdersTableShellProps>) {
  const columns = React.useMemo<ColumnDef<AwaitedOrder, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Id" />
        ),
        cell: ({ cell }) => {
          return <span>{formatId(String(cell.getValue()))}</span>
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Статус оплаты" />
        ),
        cell: ({ cell }) => {
          const rawStatus = cell.getValue() as StripePaymentStatus
          const statusLabels: Record<string, string> = {
            succeeded: "Оплачен",
            processing: "В обработке",
            requires_payment_method: "Ожидает оплаты",
            requires_confirmation: "Подтверждение",
            requires_action: "Требует действия",
            requires_capture: "Ожидает списания",
            canceled: "Отменен",
          }
          return (
            <Badge
              variant="outline"
              className={cn(
                "pointer-events-none text-xs font-medium text-white",
                getStripePaymentStatusColor({
                  status: rawStatus,
                  shade: 600,
                })
              )}
            >
              {statusLabels[rawStatus] ?? String(rawStatus)}
            </Badge>
          )
        },
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Клиент" />
        ),
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Количество" />
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Сумма" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Дата" />
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
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem asChild>
                <Link href={`/admin/zamowienia/${row.original.id}`}>
                  Детали заказа
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`https://dashboard.stripe.com/test/payments/${row.original.paymentIntentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Посмотреть в Stripe
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchableColumns={
        isSearchable
          ? [
              {
                id: "customer",
                title: "клиентам",
              },
            ]
          : []
      }
      filterableColumns={[
        {
          id: "status",
          title: "status",
          options: stripePaymentStatuses,
        },
      ]}
    />
  )
}
