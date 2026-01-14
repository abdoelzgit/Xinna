import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const purchase = await prisma.pembelian.create({
            data: {
                nonota: body.nonota,
                tgl_pembelian: new Date(body.tgl_pembelian),
                total_bayar: parseFloat(body.total_bayar),
                id_distributor: BigInt(body.id_distributor),
                details: {
                    create: body.details.map((detail: any) => ({
                        id_obat: BigInt(detail.id_obat),
                        jumlah_beli: parseInt(detail.jumlah_beli),
                        harga_beli: parseFloat(detail.harga_beli),
                        subtotal: parseFloat(detail.subtotal),
                    })),
                },
            },
            include: {
                distributor: true,
                details: {
                    include: {
                        obat: true
                    }
                },
            },
        });
        return NextResponse.json(serializeBigInt(purchase), { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create purchase" }, { status: 400 });
    }
}

export async function GET() {
    try {
        const purchases = await prisma.pembelian.findMany({
            include: {
                distributor: true,
                details: true,
            },
        });
        return NextResponse.json(serializeBigInt(purchases));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
    }
}
