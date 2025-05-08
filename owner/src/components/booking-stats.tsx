import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, Clock, DollarSign } from "lucide-react"

interface BookingStatsProps {
  totalCompletedPrice: string
}

export function BookingStats({ totalCompletedPrice }: BookingStatsProps) {
  // Inline price formatting
  const formatPrice = (priceString: string) => {
    const price = Number.parseFloat(priceString.replace(/,/g, ""))
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(totalCompletedPrice)}</div>
          <p className="text-xs text-muted-foreground">From completed bookings</p>
        </CardContent>
      </Card>
    </div>
  )
}
