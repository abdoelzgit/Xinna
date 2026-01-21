import { getSalesHistory } from "@/lib/actions/sales-actions"
import { SalesClient } from "@/components/dashboard/sales-client"

export default async function SalesPage() {
    const sales = await getSalesHistory()

    return (
        <div className="p-6 md:p-10 space-y-8">
            <SalesClient sales={sales} />
        </div>
    )
}
