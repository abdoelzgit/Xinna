"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { encodeId, decodeIdAsBigInt } from "@/lib/hashids"

// Helper to handle BigInt serialization and add hashedId
const serialize = (data: any) => {
    if (!data) return null;

    if (Array.isArray(data)) {
        return data.map(item => serialize(item));
    }

    const serialized = JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )

    // Auto-inject hashedId if id exists
    if (data.id) {
        serialized.hashedId = encodeId(data.id);
    }

    return serialized;
}

export async function getProducts(limit?: number) {
    const products = await prisma.obat.findMany({
        include: {
            jenis_obat: true,
        },
        orderBy: {
            created_at: "desc",
        },
        ...(limit ? { take: limit } : {}),
    })
    return serialize(products)
}

export async function getFilteredProducts(filters: {
    search?: string;
    category?: string;
    sort?: 'price_asc' | 'price_desc' | 'latest' | '';
}) {
    const where: any = {};

    if (filters.search) {
        where.nama_obat = {
            contains: filters.search,
            mode: 'insensitive'
        };
    }

    if (filters.category && filters.category !== 'all') {
        const catId = decodeIdAsBigInt(filters.category);
        if (catId) {
            where.id_jenis_obat = catId;
        }
    }

    const orderBy: any = {};
    if (filters.sort === 'price_asc') orderBy.harga_jual = 'asc';
    else if (filters.sort === 'price_desc') orderBy.harga_jual = 'desc';
    else orderBy.created_at = 'desc';

    const products = await prisma.obat.findMany({
        where,
        include: {
            jenis_obat: true,
        },
        orderBy,
    })
    return serialize(products)
}

export async function getProductById(id: string) {
    const numericId = decodeIdAsBigInt(id);
    if (!numericId) return null;

    const product = await prisma.obat.findUnique({
        where: { id: numericId },
        include: {
            jenis_obat: true,
        },
    })
    return product ? serialize(product) : null
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
}) {
    const product = await prisma.obat.create({
        data: {
            nama_obat: data.nama_obat,
            id_jenis_obat: BigInt(data.id_jenis_obat),
            harga_jual: data.harga_jual,
            stok: data.stok,
            deskripsi_obat: data.deskripsi_obat,
        },
    })

    revalidatePath("/dashboard/products")
    return serialize(product)
}

export async function updateProduct(
    id: string,
    data: {
        nama_obat: string
        id_jenis_obat: string
        harga_jual: number
        stok: number
        deskripsi_obat?: string
    }
) {
    const numericId = decodeIdAsBigInt(id);
    if (!numericId) throw new Error("Invalid Product ID");

    const product = await prisma.obat.update({
        where: { id: numericId },
        data: {
            nama_obat: data.nama_obat,
            id_jenis_obat: BigInt(data.id_jenis_obat),
            harga_jual: data.harga_jual,
            stok: data.stok,
            deskripsi_obat: data.deskripsi_obat,
        },
    })

    revalidatePath("/dashboard/products")
    return serialize(product)
}

export async function deleteProduct(id: string) {
    const numericId = decodeIdAsBigInt(id);
    if (!numericId) throw new Error("Invalid Product ID");

    await prisma.obat.delete({
        where: { id: numericId },
    })
    revalidatePath("/dashboard/products")
}
