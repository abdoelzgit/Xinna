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
        const distributors = await prisma.distributor.findMany();
        return NextResponse.json(serializeBigInt(distributors));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch distributors" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const distributor = await prisma.distributor.create({
            data: {
                nama_distributor: body.nama_distributor,
                telepon: body.telepon,
                alamat: body.alamat,
            },
        });
        return NextResponse.json(serializeBigInt(distributor), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create distributor" }, { status: 400 });
    }
}
