"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to handle BigInt serialization
function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function getObats() {
    try {
        const obats = await prisma.obat.findMany({
            include: {
                jenis_obat: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return serializeBigInt(obats);
    } catch (error) {
        console.error("Error fetching obats:", error);
        return [];
    }
}

export async function createObat(formData: FormData) {
    try {
        const nama_obat = formData.get("nama_obat") as string;
        const id_jenis_obat = BigInt(formData.get("id_jenis_obat") as string);
        const harga_jual = parseFloat(formData.get("harga_jual") as string);
        const stok = parseInt(formData.get("stok") as string);
        const deskripsi_obat = formData.get("deskripsi_obat") as string;

        await prisma.obat.create({
            data: {
                nama_obat,
                id_jenis_obat,
                harga_jual,
                stok,
                deskripsi_obat,
            },
        });

        revalidatePath("/obat");
        return { success: true };
    } catch (error) {
        console.error("Error creating obat:", error);
        return { success: false, error: "Failed to create medicine" };
    }
}

export async function deleteObat(id: string) {
    try {
        await prisma.obat.delete({
            where: {
                id: BigInt(id),
            },
        });
        revalidatePath("/obat");
        return { success: true };
    } catch (error) {
        console.error("Error deleting obat:", error);
        return { success: false, error: "Failed to delete medicine" };
    }
}
