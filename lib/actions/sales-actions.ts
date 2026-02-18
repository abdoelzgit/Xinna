"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { StatusOrder } from "@prisma/client"

const serialize = (data: any): any => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function getSalesHistory() {
    try {
        const sales = await prisma.penjualan.findMany({
            include: {
                pelanggan: true,
                metode_bayar: true,
                jenis_pengiriman: true,
                details: {
                    include: {
                        obat: true
                    }
                }
            },
            orderBy: {
                created_at: "asc"
            }
        })
        return serialize(sales)
    } catch (error) {
        console.error("Failed to fetch sales history:", error)
        throw new Error("Failed to fetch sales history")
    }
}

export async function updateOrderStatus(id: string, status: StatusOrder) {
    try {
        await prisma.penjualan.update({
            where: { id: BigInt(id) },
            data: { status_order: status }
        })
        revalidatePath("/dashboard/sales")
        return { success: true }
    } catch (error) {
        console.error("Failed to update order status:", error)
        return { error: "Gagal memperbarui status pesanan." }
    }
}

export async function getUserPurchases(email: string) {
    try {
        const purchases = await prisma.penjualan.findMany({
            where: {
                pelanggan: {
                    email: email
                }
            },
            include: {
                details: {
                    include: {
                        obat: true
                    }
                },
                jenis_pengiriman: true,
                metode_bayar: true
            },
            orderBy: {
                created_at: "desc"
            }
        })
        return serialize(purchases)
    } catch (error) {
        console.error("Failed to fetch user purchases:", error)
        return []
    }
}
