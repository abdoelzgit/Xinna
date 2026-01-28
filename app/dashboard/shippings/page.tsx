import { getShippings, getPendingSales } from "@/lib/actions/shipping-actions"
import { ShippingsClient } from "@/components/dashboard/shippings-client"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ShippingsPage() {
    const session = await getServerSession(authOptions)

    // Only Staff can access
    const allowedRoles = ['admin', 'apoteker', 'pemilik', 'karyawan', 'kasir']
    const userRole = (session?.user as any)?.jabatan

    if (!session || !allowedRoles.includes(userRole)) {
        redirect("/dashboard?error=unauthorized")
    }

    // Fetch data in parallel
    const [shippings, pendingSales] = await Promise.all([
        getShippings(),
        getPendingSales()
    ])

    return (
        <div className="p-6 md:p-10 space-y-8">
            <ShippingsClient
                shippings={shippings}
                pendingSales={pendingSales}
            />
        </div>
    )
}
