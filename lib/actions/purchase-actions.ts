"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const serialize = (data: any): any => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function getPurchases() {
    try {
        const purchases = await prisma.pembelian.findMany({
            include: {
                distributor: true,
                details: {
                    include: {
                        obat: true
                    }
                }
            },
            orderBy: {
                tgl_pembelian: "desc"
            }
        })
        return serialize(purchases)
    } catch (error) {
        console.error("Failed to fetch purchases:", error)
        throw new Error("Failed to fetch purchases")
    }
}

export async function getDistributors() {
    try {
        const distributors = await prisma.distributor.findMany({
            orderBy: {
                nama_distributor: "asc"
            }
        })
        return serialize(distributors)
    } catch (error) {
        console.error("Failed to fetch distributors:", error)
        throw new Error("Failed to fetch distributors")
    }
}

export async function getMedicines() {
    try {
        const medicines = await prisma.obat.findMany({
            orderBy: {
                nama_obat: "asc"
            }
        })
        return serialize(medicines)
    } catch (error) {
        console.error("Failed to fetch medicines:", error)
        throw new Error("Failed to fetch medicines")
    }
}

export async function createPurchase(data: {
    nonota: string
    tgl_pembelian: Date
    id_distributor: string
    total_bayar: number
    items: {
        id_obat: string
        jumlah_beli: number
        harga_beli: number
        subtotal: number
    }[]
}) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the Purchase record
            const purchase = await tx.pembelian.create({
                data: {
                    nonota: data.nonota,
                    tgl_pembelian: data.tgl_pembelian,
                    id_distributor: BigInt(data.id_distributor),
                    total_bayar: data.total_bayar,
                    details: {
                        create: data.items.map((item) => ({
                            id_obat: BigInt(item.id_obat),
                            jumlah_beli: item.jumlah_beli,
                            harga_beli: item.harga_beli,
                            subtotal: item.subtotal
                        }))
                    }
                }
            })

            // 2. Update Medicine stock for each item
            for (const item of data.items) {
                await tx.obat.update({
                    where: { id: BigInt(item.id_obat) },
                    data: {
                        stok: {
                            increment: item.jumlah_beli
                        }
                    }
                })
            }

            return purchase
        })

        revalidatePath("/dashboard/purchases")
        revalidatePath("/dashboard/products")
        return { success: true, data: serialize(result) }
    } catch (error) {
        console.error("Failed to create purchase:", error)
        return { error: "Gagal mencatat pembelian. Silakan periksa data Anda." }
    }
}

export async function deletePurchase(id: string) {
    try {
        await prisma.pembelian.delete({
            where: { id: BigInt(id) }
        })
        revalidatePath("/dashboard/purchases")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete purchase:", error)
        return { error: "Gagal menghapus data pembelian." }
    }
}
