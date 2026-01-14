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
        const distributor = await prisma.distributor.update({
            where: { id: BigInt(id) },
            data: {
                nama_distributor: body.nama_distributor,
                telepon: body.telepon,
                alamat: body.alamat,
            },
        });
        return NextResponse.json(serializeBigInt(distributor));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update distributor" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.distributor.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "Distributor deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete distributor" }, { status: 400 });
    }
}
