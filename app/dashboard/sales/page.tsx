import { getSalesHistory } from "@/lib/actions/sales-actions"
import { SalesClient } from "@/components/dashboard/sales-client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"


export default async function SalesPage() {
    const session = await getServerSession(authOptions)

    const allowedRoles = ['admin', 'apoteker', 'pemilik']

    const userRole = (session?.user as any)?.jabatan
    if (!session || !allowedRoles.includes(userRole)) {
        redirect("/dashboard?error=unauthorized")
    }

    const sales = await getSalesHistory()

    return (


        <div className="p-6 md:p-10 space-y-8">
            <SalesClient sales={sales} />
        </div>
    )
}
