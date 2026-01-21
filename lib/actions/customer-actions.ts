"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

const serialize = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function registerCustomer(data: {
    nama_pelanggan: string
    email: string
    katakunci: string
    no_telp?: string
    alamat1?: string
    kota1?: string
    propinsi1?: string
    kodepos1?: string
}) {
    try {
        // Check if email already exists
        const existing = await prisma.pelanggan.findUnique({
            where: { email: data.email }
        })

        if (existing) {
            return { error: "Email sudah terdaftar. Silakan gunakan email lain atau login." }
        }

        const hashedPassword = await bcrypt.hash(data.katakunci, 10)

        const customer = await prisma.pelanggan.create({
            data: {
                nama_pelanggan: data.nama_pelanggan,
                email: data.email,
                katakunci: hashedPassword,
                no_telp: data.no_telp,
                alamat1: data.alamat1,
                kota1: data.kota1,
                propinsi1: data.propinsi1,
                kodepos1: data.kodepos1,
            }
        })

        return { success: true, customer: serialize(customer) }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi nanti." }
    }
}

export async function getCustomers() {
    const customers = await prisma.pelanggan.findMany({
        orderBy: {
            created_at: "desc",
        },
    })
    return serialize(customers)
}

export async function getProfileData(email: string) {
    try {
        const pelanggan = await prisma.pelanggan.findUnique({
            where: { email }
        })

        if (pelanggan) {
            return { success: true, type: "customer", data: serialize(pelanggan) }
        }

        const staff = await prisma.user.findUnique({
            where: { email }
        })

        if (staff) {
            return { success: true, type: "staff", data: serialize(staff) }
        }

        return { error: "User not found" }
    } catch (error) {
        return { error: "Failed to fetch profile data" }
    }
}

export async function updateCustomer(id: string, data: {
    nama_pelanggan: string
    no_telp?: string
    alamat1?: string
    kota1?: string
    propinsi1?: string
    kodepos1?: string
}) {
    try {
        const updated = await prisma.pelanggan.update({
            where: { id: BigInt(id) },
            data: {
                nama_pelanggan: data.nama_pelanggan,
                no_telp: data.no_telp,
                alamat1: data.alamat1,
                kota1: data.kota1,
                propinsi1: data.propinsi1,
                kodepos1: data.kodepos1,
            }
        })

        revalidatePath("/profile")
        return { success: true, customer: serialize(updated) }
    } catch (error) {
        console.error("Update error:", error)
        return { error: "Gagal memperbarui profil." }
    }
}
