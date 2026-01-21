import { getCartItems } from "@/lib/actions/cart-actions"
import { CartClient } from "@/components/cart-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Keranjang - Xinna",
}

export default async function CartPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    if ((session.user as any).userType !== "customer") {
        redirect("/")
    }

    const cartItems = await getCartItems()

    return (
        <div className="bg-white min-h-screen">
            <main className="container px-4 md:px-8 py-20 mx-auto">
                <CartClient initialItems={cartItems} />
            </main>
        </div>
    )
}
