import { getPurchases, getDistributors, getMedicines } from "@/lib/actions/purchase-actions"
import { PurchasesClient } from "@/components/dashboard/purchases-client"

export default async function PurchasesPage() {
    // Fetch all required data in parallel
    const [purchases, distributors, medicines] = await Promise.all([
        getPurchases(),
        getDistributors(),
        getMedicines()
    ])

    return (
        <div className="p-6 md:p-10 space-y-8">
            <PurchasesClient
                purchases={purchases}
                distributors={distributors}
                medicines={medicines}
            />
        </div>
    )
}
