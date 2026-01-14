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
        const customer = await prisma.pelanggan.update({
            where: { id: BigInt(id) },
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
        return NextResponse.json(serializeBigInt(customer));
    } catch (error) {
        return NextResponse.json({ error: "Failed to update customer" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        await prisma.pelanggan.delete({
            where: { id: BigInt(id) },
        });
        return NextResponse.json({ message: "Customer deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 400 });
    }
}
