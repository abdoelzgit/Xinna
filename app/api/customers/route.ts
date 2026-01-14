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
        const customers = await prisma.pelanggan.findMany({
            include: {
                penjualans: true,
                keranjangs: true,
            },
        });
        return NextResponse.json(serializeBigInt(customers));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const customer = await prisma.pelanggan.create({
            data: {
                nama_pelanggan: body.nama_pelanggan,
                email: body.email,
                katakunci: body.katakunci,
                no_telp: body.no_telp,
                alamat1: body.alamat1,
                kota1: body.kota1,
                propinsi1: body.propinsi1,
                kodepos1: body.kodepos1,
            },
        });
        return NextResponse.json(serializeBigInt(customer), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create customer" }, { status: 400 });
    }
}
