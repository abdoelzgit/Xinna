import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { getCartItems } from "@/lib/actions/cart-actions"
import { getCheckoutData } from "@/lib/actions/checkout-actions"
import { CheckoutClient } from "@/components/checkout-client"

export const metadata = {
    title: "Checkout - Xinna",
}

export default async function CheckoutPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    if ((session.user as any).userType !== "customer") {
        redirect("/")
    }

    const userId = BigInt((session.user as any).id)

    // Fetch all necessary data
    const [cartItems, pelanggan, masterData] = await Promise.all([
        getCartItems(),
        prisma.pelanggan.findUnique({ where: { id: userId } }),
        getCheckoutData()
    ])

    if (cartItems.length === 0) {
        redirect("/cart")
    }

    const serialize = (data: any) => JSON.parse(JSON.stringify(data, (key, value) => typeof value === "bigint" ? value.toString() : value))

    return (
        <div className="bg-white min-h-screen">
            <main className="container px-4 md:px-8 py-20 mx-auto">
                <CheckoutClient
                    cartItems={cartItems}
                    pelanggan={serialize(pelanggan)}
                    metodeBayar={masterData.metodeBayar}
                    jenisPengiriman={masterData.jenisPengiriman}
                />
            </main>
        </div>
    )
}

import Link from "next/link"
