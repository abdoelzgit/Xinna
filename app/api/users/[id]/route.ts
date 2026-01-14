import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function serializeBigInt(data: any) {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const user = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                jabatan: body.jabatan,
            },
        });
        return NextResponse.json(serializeBigInt(user));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.user.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 400 });
    }
}
