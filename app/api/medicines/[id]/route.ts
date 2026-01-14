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
        const medicine = await prisma.obat.update({
            where: { id: BigInt(id) },
            data: {
                nama_obat: body.nama_obat,
                id_jenis_obat: body.id_jenis_obat ? BigInt(body.id_jenis_obat) : undefined,
                harga_jual: body.harga_jual ? parseFloat(body.harga_jual) : undefined,
                stok: body.stok ? parseInt(body.stok) : undefined,
                deskripsi_obat: body.deskripsi_obat,
                foto1: body.foto1,
            },
        });
        return NextResponse.json(serializeBigInt(medicine));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update medicine" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.obat.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete medicine" }, { status: 400 });
    }
}
