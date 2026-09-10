import type { StripePaymentStatus } from "@/types"

import { cn } from "@/lib/utils"

export const stripePaymentStatuses: {
  label: string
  value: StripePaymentStatus
}[] = [
  { label: "Отменен", value: "canceled" },
  { label: "В обработке", value: "processing" },
  { label: "Требует действия", value: "requires_action" },
  { label: "Ожидает списания", value: "requires_capture" },
  { label: "Требует подтверждения", value: "requires_confirmation" },
  { label: "Ожидает оплаты", value: "requires_payment_method" },
  { label: "Оплачен успешно", value: "succeeded" },
]

export function getStripePaymentStatusColor({
  status,
  shade = 600,
}: {
  status: StripePaymentStatus
  shade?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
}) {
  const bg = `bg-${shade}`

  return cn({
    [`${bg}-red`]: status === "canceled",
    [`${bg}-yellow`]: [
      "processing",
      "requires_action",
      "requires_capture",
      "requires_confirmation",
      "requires_payment_method",
    ].includes(status),
    [`bg-green-${shade}`]: status === "succeeded",
  })
}
