"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const serialize = (data: any): any => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function getShippings() {
    try {
        const shippings = await prisma.pengiriman.findMany({
            include: {
                penjualan: {
                    include: {
                        pelanggan: true,
                        jenis_pengiriman: true
                    }
                },
                user: true
            },
            orderBy: {
                created_at: "desc"
            }
        })
        return serialize(shippings)
    } catch (error) {
        console.error("Failed to fetch shippings:", error)
        throw new Error("Failed to fetch shippings")
    }
}

export async function getPendingSales() {
    try {
        // Sales that are confirmed or being processed but not yet in the shipping log
        const sales = await prisma.penjualan.findMany({
            where: {
                status_order: {
                    in: ["Menunggu_Konfirmasi", "Diproses", "Menunggu_Kurir"]
                },
                // Optionally: Filter out those already in pengiriman table
                pengirimans: {
                    none: {}
                }
            },
            include: {
                pelanggan: true
            },
            orderBy: {
                created_at: "desc"
            }
        })
        return serialize(sales)
    } catch (error) {
        console.error("Failed to fetch pending sales:", error)
        throw new Error("Failed to fetch pending sales")
    }
}

export async function createShipping(data: {
    id_penjualan: string
    tgl_pengiriman: Date
    keterangan?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any).userType !== "staff") {
            return { error: "Hanya staff yang dapat mencatat pengiriman." }
        }

        const userId = BigInt((session.user as any).id)

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Pengiriman record
            const shipping = await tx.pengiriman.create({
                data: {
                    id_penjualan: BigInt(data.id_penjualan),
                    id_user: userId,
                    tgl_pengiriman: data.tgl_pengiriman,
                    keterangan: data.keterangan || ""
                }
            })

            // 2. Update Order Status to "Menunggu_Kurir" if it was "Diproses"
            await tx.penjualan.update({
                where: { id: BigInt(data.id_penjualan) },
                data: { status_order: "Menunggu_Kurir" }
            })

            return shipping
        })

        revalidatePath("/dashboard/shippings")
        revalidatePath("/dashboard/sales")
        return { success: true, data: serialize(result) }
    } catch (error) {
        console.error("Failed to create shipping:", error)
        return { error: "Gagal mencatat pengiriman. Silakan coba lagi." }
    }
}
