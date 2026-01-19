"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Helper to handle BigInt serialization
const serialize = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function getProductById(id: string) {
    const product = await prisma.obat.findUnique({
        where: { id: BigInt(id) },
        include: {
            jenis_obat: true,
        },
    })
    return product ? serialize(product) : null
}

export async function getProducts() {
    const products = await prisma.obat.findMany({
        include: {
            jenis_obat: true,
        },
        orderBy: {
            updated_at: "desc",
        },
    })
    return serialize(products)
}

export async function getCategories() {
    const categories = await prisma.jenisObat.findMany({
        orderBy: {
            jenis: "asc",
        },
    })
    return serialize(categories)
}

export async function createProduct(data: {
    nama_obat: string
    id_jenis_obat: string
    harga_jual: number
    stok: number
    deskripsi_obat?: string
    foto1?: string
    foto2?: string
    foto3?: string
}) {
    await prisma.obat.create({
        data: {
            nama_obat: data.nama_obat,
            jenis_obat: { connect: { id: BigInt(data.id_jenis_obat) } },
            harga_jual: data.harga_jual,
            stok: data.stok,
            deskripsi_obat: data.deskripsi_obat,
            foto1: data.foto1,
            foto2: data.foto2,
            foto3: data.foto3,
        },
    })
    revalidatePath("/dashboard/products")
    revalidatePath("/")
}

export async function updateProduct(
    id: string,
    data: {
        nama_obat: string
        id_jenis_obat: string
        harga_jual: number
        stok: number
        deskripsi_obat?: string
        foto1?: string
        foto2?: string
        foto3?: string
    }
) {
    await prisma.obat.update({
        where: { id: BigInt(id) },
        data: {
            nama_obat: data.nama_obat,
            jenis_obat: { connect: { id: BigInt(data.id_jenis_obat) } },
            harga_jual: data.harga_jual,
            stok: data.stok,
            deskripsi_obat: data.deskripsi_obat,
            foto1: data.foto1,
            foto2: data.foto2,
            foto3: data.foto3,
        },
    })
    revalidatePath("/dashboard/products")
    revalidatePath("/")
}

export async function deleteProduct(id: string) {
    await prisma.obat.delete({
        where: { id: BigInt(id) },
    })
    revalidatePath("/dashboard/products")
}
