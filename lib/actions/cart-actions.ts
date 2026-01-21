"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { decodeIdAsBigInt } from "@/lib/hashids"
import { revalidatePath } from "next/cache"

/**
 * Mendapatkan total jumlah item unik dalam keranjang pelanggan
 */
export async function getCartCount() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "customer") {
        return 0
    }

    const userId = BigInt((session.user as any).id)

    const count = await prisma.keranjang.count({
        where: { id_pelanggan: userId }
    })

    return count
}

/**
 * Menambahkan produk ke keranjang
 */
export async function addToCart(hashedProductId: string, quantity: number) {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("UNAUTHORIZED")
    }

    if ((session.user as any).userType !== "customer") {
        throw new Error("ONLY_CUSTOMERS_CAN_SHOP")
    }

    const userId = BigInt((session.user as any).id)
    const productId = decodeIdAsBigInt(hashedProductId)

    if (!productId) {
        throw new Error("INVALID_PRODUCT")
    }

    // 1. Cek stok obat
    const product = await prisma.obat.findUnique({
        where: { id: productId }
    })

    if (!product) {
        throw new Error("PRODUCT_NOT_FOUND")
    }

    if (product.stok < quantity) {
        throw new Error("INSUFFICIENT_STOCK")
    }

    // 2. Cek apakah barang sudah ada di keranjang
    const existingItem = await prisma.keranjang.findFirst({
        where: {
            id_pelanggan: userId,
            id_obat: productId
        }
    })

    if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.jumlah_beli + quantity

        if (product.stok < newQuantity) {
            throw new Error("INSUFFICIENT_STOCK_TOTAL")
        }

        await prisma.keranjang.update({
            where: { id: existingItem.id },
            data: {
                jumlah_beli: newQuantity,
                subtotal: (existingItem.harga_beli * newQuantity)
            }
        })
    } else {
        // Create new item
        await prisma.keranjang.create({
            data: {
                id_pelanggan: userId,
                id_obat: productId,
                jumlah_beli: quantity,
                harga_beli: product.harga_jual,
                subtotal: product.harga_jual * quantity
            }
        })
    }

    revalidatePath("/")
    revalidatePath("/medicine/[id]", "page")

    return { success: true }
}

/**
 * Mengambil semua item dalam keranjang
 */
export async function getCartItems() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "customer") {
        return []
    }

    const userId = BigInt((session.user as any).id)

    const items = await prisma.keranjang.findMany({
        where: { id_pelanggan: userId },
        include: {
            obat: true
        }
    })

    // Serialization for Client Components
    return JSON.parse(
        JSON.stringify(items, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

/**
 * Update kuantitas item di keranjang
 */
export async function updateCartQuantity(cartId: string, quantity: number) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("UNAUTHORIZED")

    const cart = await prisma.keranjang.findUnique({
        where: { id: BigInt(cartId) },
        include: { obat: true }
    })

    if (!cart) throw new Error("NOT_FOUND")

    if (cart.obat.stok < quantity) {
        throw new Error("INSUFFICIENT_STOCK")
    }

    await prisma.keranjang.update({
        where: { id: BigInt(cartId) },
        data: {
            jumlah_beli: quantity,
            subtotal: cart.harga_beli * quantity
        }
    })

    revalidatePath("/cart")
    return { success: true }
}

/**
 * Hapus item dari keranjang
 */
export async function removeFromCart(cartId: string) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("UNAUTHORIZED")

    await prisma.keranjang.delete({
        where: { id: BigInt(cartId) }
    })

    revalidatePath("/cart")
    return { success: true }
}
