"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { Jabatan } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Helper to handle BigInt serialization
const serialize = (data: any) => {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )
}

export async function getUsers() {
    const users = await prisma.user.findMany({
        orderBy: {
            created_at: "desc",
        },
    })
    return serialize(users)
}

export async function getUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id: BigInt(id) },
    })
    return user ? serialize(user) : null
}

export async function createUser(data: {
    name: string
    email: string
    password: string
    jabatan: Jabatan
}) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            jabatan: data.jabatan,
        },
    })

    revalidatePath("/dashboard/users")
    return serialize(user)
}

export async function updateUser(
    id: string,
    data: {
        name: string
        email: string
        password?: string
        jabatan: Jabatan
    }
) {
    const session = await getServerSession(authOptions)
    const currentUserId = (session?.user as any)?.id

    const updateData: any = {
        name: data.name,
        email: data.email,
    }

    if (id === currentUserId) {
        // Fetch current user to ensure jabatan is not changed if it's a self-edit
        const currentUser = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            select: { jabatan: true }
        })

        if (currentUser && currentUser.jabatan !== data.jabatan) {
            throw new Error("Anda tidak dapat mengubah jabatan Anda sendiri demi keamanan.")
        }
    } else {
        // Only update jabatan if it's not a self-edit
        updateData.jabatan = data.jabatan
    }

    if (data.password && data.password.trim() !== "") {
        updateData.password = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({
        where: { id: BigInt(id) },
        data: updateData,
    })

    revalidatePath("/dashboard/users")
    return serialize(user)
}

export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: { id: BigInt(id) },
    })
    revalidatePath("/dashboard/users")
}
