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
        const methods = await prisma.metodeBayar.findMany();
        return NextResponse.json(serializeBigInt(methods));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const method = await prisma.metodeBayar.create({
            data: {
                metode_pembayaran: body.metode_pembayaran,
                tempat_bayar: body.tempat_bayar,
                no_rekening: body.no_rekening,
            },
        });
        return NextResponse.json(serializeBigInt(method), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create payment method" }, { status: 400 });
    }
}
