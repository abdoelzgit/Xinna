import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const purchase = await prisma.pembelian.findUnique({
            where: { id: BigInt(id) },
            include: {
                distributor: true,
                details: { include: { obat: true } },
            },
        });
        if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        return NextResponse.json(serializeBigInt(purchase));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch purchase" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.detailPembelian.deleteMany({ where: { id_pembelian: BigInt(id) } });
        await prisma.pembelian.delete({ where: { id: BigInt(id) } });
        return NextResponse.json({ message: "Purchase deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete purchase" }, { status: 400 });
    }
}
