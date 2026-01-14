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

        // Create Penjualan and its nested Details in one transaction to test relations
        const sale = await prisma.penjualan.create({
            data: {
                id_metode_bayar: BigInt(body.id_metode_bayar),
                tgl_penjualan: new Date(),
                ongkos_kirim: parseFloat(body.ongkos_kirim),
                biaya_app: parseFloat(body.biaya_app),
                total_bayar: parseFloat(body.total_bayar),
                status_order: "Menunggu_Konfirmasi",
                id_jenis_kirim: BigInt(body.id_jenis_kirim),
                id_pelanggan: BigInt(body.id_pelanggan),
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
                details: true,
                pelanggan: true,
            },
        });

        return NextResponse.json(serializeBigInt(sale), { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create sale and relations" }, { status: 400 });
    }
}

export async function GET() {
    try {
        const sales = await prisma.penjualan.findMany({
            include: {
                details: {
                    include: {
                        obat: true
                    }
                },
                pelanggan: true,
                metode_bayar: true,
                jenis_pengiriman: true
            },
        });
        return NextResponse.json(serializeBigInt(sales));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
    }
}
