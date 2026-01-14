import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper to handle BigInt serialization
function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function GET() {
    try {
        const categories = await prisma.jenisObat.findMany({
            include: {
                obats: true,
            },
        });
        return NextResponse.json(serializeBigInt(categories));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const category = await prisma.jenisObat.create({
            data: {
                jenis: body.jenis,
                deskripsi_jenis: body.deskripsi_jenis,
                image_url: body.image_url,
            },
        });
        return NextResponse.json(serializeBigInt(category), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 400 });
    }
}
