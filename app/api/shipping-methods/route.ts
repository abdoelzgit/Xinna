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
        const shipping = await prisma.jenisPengiriman.findMany();
        return NextResponse.json(serializeBigInt(shipping));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch shipping methods" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const shipping = await prisma.jenisPengiriman.create({
            data: {
                jenis_kirim: body.jenis_kirim,
                nama_ekspedisi: body.nama_ekspedisi,
            },
        });
        return NextResponse.json(serializeBigInt(shipping), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create shipping method" }, { status: 400 });
    }
}
