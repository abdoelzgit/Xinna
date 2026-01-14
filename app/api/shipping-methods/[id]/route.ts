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
        const shipping = await prisma.jenisPengiriman.update({
            where: { id: BigInt(id) },
            data: {
                jenis_kirim: body.jenis_kirim,
                nama_ekspedisi: body.nama_ekspedisi,
            },
        });
        return NextResponse.json(serializeBigInt(shipping));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update shipping method" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.jenisPengiriman.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "Shipping method deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete shipping method" }, { status: 400 });
    }
}
