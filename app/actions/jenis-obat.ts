"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function getJenisObats() {
    try {
        const jenis = await prisma.jenisObat.findMany({
            orderBy: {
                jenis: "asc",
            },
        });
        return serializeBigInt(jenis);
    } catch (error) {
        console.error("Error fetching jenis obat:", error);
        return [];
    }
}

export async function createJenisObat(formData: FormData) {
    try {
        const jenis = formData.get("jenis") as string;
        const deskripsi_jenis = formData.get("deskripsi_jenis") as string;

        await prisma.jenisObat.create({
            data: {
                jenis,
                deskripsi_jenis,
            },
        });

        revalidatePath("/jenis-obat");
        return { success: true };
    } catch (error) {
        console.error("Error creating jenis obat:", error);
        return { success: false, error: "Failed to create category" };
    }
}
