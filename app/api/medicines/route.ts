import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function GET() {
    try {
        const medicines = await prisma.obat.findMany({
            include: {
                jenis_obat: true,
            },
        });
        return NextResponse.json(serializeBigInt(medicines));
    } catch (error: any) {
        console.error("Prisma Error:", error);
        return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const medicine = await prisma.obat.create({
            data: {
                nama_obat: body.nama_obat,
                id_jenis_obat: BigInt(body.id_jenis_obat),
                harga_jual: parseFloat(body.harga_jual),
                stok: parseInt(body.stok),
                deskripsi_obat: body.deskripsi_obat,
                foto1: body.foto1,
            },
        });
        return NextResponse.json(serializeBigInt(medicine), { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create medicine" }, { status: 400 });
    }
}
