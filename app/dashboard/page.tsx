import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { RecentPurchases } from "@/components/dashboard/recent-purchases"
import { getDashboardStats } from "@/lib/actions/dashboard-actions"

export default async function DashboardPage() {
  const data = await getDashboardStats()

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards stats={data.stats} />

        <div className="flex flex-col gap-6">
          <RecentOrders orders={data.recentOrders} />
          <RecentPurchases purchases={data.recentPurchases} />
        </div>
      </div>
    </div>
  )
}
