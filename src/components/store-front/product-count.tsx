import { Badge } from "@/components/ui/badge"

interface ProductCountProps {
  count: number
}

export function ProductCount({
  count,
}: Readonly<ProductCountProps>): JSX.Element {
  return (
    <Badge
      variant="secondary"
      className="pointer-events-none w-fit rounded font-medium"
    >
      {count} изделий
    </Badge>
  )
}
