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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const sale = await prisma.penjualan.findUnique({
            where: { id: BigInt(id) },
            include: {
                details: { include: { obat: true } },
                pelanggan: true,
                metode_bayar: true,
                jenis_pengiriman: true,
            },
        });
        if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });
        return NextResponse.json(serializeBigInt(sale));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sale" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Note: DetailPenjualan should be deleted first if not on cascade
        // Prisma handles this if specified in schema, but for safety let's delete details
        await prisma.detailPenjualan.deleteMany({ where: { id_penjualan: BigInt(id) } });
        await prisma.penjualan.delete({ where: { id: BigInt(id) } });
        return NextResponse.json({ message: "Sale deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete sale" }, { status: 400 });
    }
}
