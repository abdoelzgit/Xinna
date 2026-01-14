import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const category = await prisma.jenisObat.update({
            where: { id: BigInt(id) },
            data: {
                jenis: body.jenis,
                deskripsi_jenis: body.deskripsi_jenis,
                image_url: body.image_url,
            },
        });
        return NextResponse.json(serializeBigInt(category));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.jenisObat.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 400 });
    }
}
