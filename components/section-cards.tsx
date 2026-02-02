import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  stats: {
    totalRevenue: number
    revenueGrowth: string
    totalSales: number
    totalProducts: number
    totalCustomers: number
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-xl font-bold tabular-nums @[250px]/card:text-2xl">
            {formatCurrency(stats.totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge variant={parseFloat(stats.revenueGrowth) >= 0 ? "outline" : "destructive"}>
              {parseFloat(stats.revenueGrowth) >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {stats.revenueGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-400">
          Trend vs last month
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Transactions</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {stats.totalSales}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-400">
          Orders processed
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {stats.totalProducts}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-400">
          Registered medicines
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {stats.totalCustomers}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-[10px] uppercase font-black tracking-widest text-slate-400">
          Users registered in app
        </CardFooter>
      </Card>
    </div>
  )
}
