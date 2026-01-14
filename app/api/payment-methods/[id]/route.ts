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
        const method = await prisma.metodeBayar.update({
            where: { id: BigInt(id) },
            data: {
                metode_pembayaran: body.metode_pembayaran,
                tempat_bayar: body.tempat_bayar,
                no_rekening: body.no_rekening,
            },
        });
        return NextResponse.json(serializeBigInt(method));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update payment method" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.metodeBayar.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "Payment method deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete payment method" }, { status: 400 });
    }
}
