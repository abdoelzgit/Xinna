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
        const users = await prisma.user.findMany();
        return NextResponse.json(serializeBigInt(users));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password, // Ideally hashed in real app
                jabatan: body.jabatan, // admin, apoteker, karyawan, kasir, pemilik
            },
        });
        return NextResponse.json(serializeBigInt(user), { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
    }
}
