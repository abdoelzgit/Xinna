"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

/**
 * Mengambil data master untuk checkout (Metode Bayar & Jenis Pengiriman)
 */
export async function getCheckoutData() {
    const [metodeBayar, jenisPengiriman] = await Promise.all([
        prisma.metodeBayar.findMany(),
        prisma.jenisPengiriman.findMany()
    ])

    // Serialization
    const serialize = (data: any) => JSON.parse(JSON.stringify(data, (key, value) => typeof value === "bigint" ? value.toString() : value))

    return {
        metodeBayar: serialize(metodeBayar),
        jenisPengiriman: serialize(jenisPengiriman)
    }
}

/**
 * Membuat pesanan (Penjualan & DetailPenjualan)
 */
export async function createOrder(data: {
    id_metode_bayar: string
    id_jenis_kirim: string
    ongkos_kirim: number
    biaya_app: number
    shipping_address: {
        nama: string
        telp: string
        alamat: string
        kota: string
        propinsi: string
        kodepos: string
    }
}) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "customer") {
        throw new Error("UNAUTHORIZED")
    }

    const userId = BigInt((session.user as any).id)

    // 1. Ambil isi keranjang
    const cartItems = await prisma.keranjang.findMany({
        where: { id_pelanggan: userId },
        include: { obat: true }
    })

    if (cartItems.length === 0) {
        throw new Error("CART_EMPTY")
    }

    // 2. Hitung total
    const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0)
    const total_bayar = subtotal + data.ongkos_kirim + data.biaya_app

    // 3. Jalankan Transaksi
    const result = await prisma.$transaction(async (tx) => {
        // a. Create Penjualan
        const penjualan = await tx.penjualan.create({
            data: {
                id_pelanggan: userId,
                id_metode_bayar: BigInt(data.id_metode_bayar),
                id_jenis_kirim: BigInt(data.id_jenis_kirim),
                tgl_penjualan: new Error("not implemented").stack?.includes("test") ? new Date() : new Date(), // Just making sure date is fresh
                ongkos_kirim: data.ongkos_kirim,
                biaya_app: data.biaya_app,
                total_bayar: total_bayar,
                status_order: "Menunggu_Konfirmasi",
            }
        })

        // b. Create DetailPenjualan & Update Stok
        for (const item of cartItems) {
            // Check stok again
            if (item.obat.stok < item.jumlah_beli) {
                throw new Error(`Stok ${item.obat.nama_obat} tidak mencukupi`)
            }

            await tx.detailPenjualan.create({
                data: {
                    id_penjualan: penjualan.id,
                    id_obat: item.id_obat,
                    jumlah_beli: item.jumlah_beli,
                    harga_beli: item.harga_beli,
                    subtotal: item.subtotal
                }
            })

            await tx.obat.update({
                where: { id: item.id_obat },
                data: { stok: { decrement: item.jumlah_beli } }
            })
        }

        // c. Update Pelanggan Address (Optional but good for UX)
        await tx.pelanggan.update({
            where: { id: userId },
            data: {
                nama_pelanggan: data.shipping_address.nama,
                no_telp: data.shipping_address.telp,
                alamat1: data.shipping_address.alamat,
                kota1: data.shipping_address.kota,
                propinsi1: data.shipping_address.propinsi,
                kodepos1: data.shipping_address.kodepos
            }
        })

        // d. Clear Cart
        await tx.keranjang.deleteMany({
            where: { id_pelanggan: userId }
        })

        return penjualan
    })

    revalidatePath("/cart")
    revalidatePath("/dashboard/inventory") // If there is inventory view

    return { success: true, orderId: result.id.toString() }
}
