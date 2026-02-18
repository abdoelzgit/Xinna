"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { Jabatan } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { encodeId, decodeIdAsBigInt } from "@/lib/hashids"

// Helper to handle BigInt serialization and add hashedId
const serialize = (data: any): any => {
    if (!data) return null;

    if (Array.isArray(data)) {
        return data.map(item => serialize(item));
    }

    const serialized = JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    )

    // Auto-inject hashedId
    if (data.id) {
        serialized.hashedId = encodeId(data.id);
    }

    return serialized;
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
    const numericId = decodeIdAsBigInt(id);
    if (!numericId) return null;

    const user = await prisma.user.findUnique({
        where: { id: numericId },
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
    const numericId = decodeIdAsBigInt(id);
    if (!numericId) throw new Error("Invalid User ID");

    const updateData: any = {
        name: data.name,
        email: data.email,
    }

    // Protection: If target user is an Admin, their role cannot be changed
    const targetUser = await prisma.user.findUnique({
        where: { id: numericId },
        select: { jabatan: true }
    })

    if (targetUser?.jabatan === "admin") {
        if (data.jabatan !== "admin") {
            throw new Error("Akun dengan jabatan Admin tidak dapat diubah rolenya demi keamanan sistem.")
        }
        // Keep it as admin
        updateData.jabatan = "admin"
    } else {
        // Target is not admin, role can be changed (e.g. promoted to admin)
        updateData.jabatan = data.jabatan
    }

    if (data.password && data.password.trim() !== "") {
        updateData.password = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({
        where: { id: numericId },
        data: updateData,
    })

    revalidatePath("/dashboard/users")
    return serialize(user)
}

export async function deleteUser(id: string) {
    const numericId = decodeIdAsBigInt(id);
    if (!numericId) throw new Error("Invalid User ID");

    await prisma.user.delete({
        where: { id: numericId },
    })
    revalidatePath("/dashboard/users")
}
