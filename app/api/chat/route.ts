import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { encodeId } from "@/lib/hashids"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { message, history } = body
        console.log("AI Chat Request received:", { message, historyLength: history?.length })

        if (!process.env.GOOGLE_AI_API_KEY) {
            console.error("Error: GOOGLE_AI_API_KEY is missing")
            return NextResponse.json(
                { error: "API Key belum dikonfigurasi" },
                { status: 500 }
            )
        }

        // 1. Fetch Context (Live Products)
        console.log("Fetching product context...")
        const products = await prisma.obat.findMany({
            where: { stok: { gt: 0 } }, // Only available products
            select: {
                id: true,
                nama_obat: true,
                harga_jual: true,
                deskripsi_obat: true,
                stok: true,
                foto1: true,
                jenis_obat: {
                    select: { jenis: true }
                }
            }
        })
        console.log(`Context loaded: ${products.length} products`)

        // 2. Build System Prompt
        const productContext = products.map(p => {
            const hashedId = encodeId(p.id)
            return `- ${p.nama_obat} (${p.jenis_obat?.jenis}): Rp${p.harga_jual}. Stok: ${p.stok}. HashedID: ${hashedId}. Image: ${p.foto1 || ''}. Info: ${p.deskripsi_obat}`
        }).join("\n")

        const systemPrompt = `
        Anda adalah asisten apoteker AI yang ramah dan profesional untuk apotek "Xinna Pharma".
        
        Tugas Anda:
        1. Menjawab pertanyaan pelanggan tentang kesehatan dan obat-obatan.
        2. MEREKOMENDASIKAN obat yang HANYA ada di daftar inventaris di bawah ini.
        3. Jika memberikan rekomendasi produk, Anda WAJIB menyertakan blok data produk di AKHIR pesan Anda dengan format tepat seperti ini:
           [PRODUCT:{"id":"hashed_id", "name":"Nama Obat", "price":harga, "image":"url_gambar"}]
        4. Jika obat yang diminta tidak ada, tawarkan alternatif dari daftar jika relevan, atau katakan stok kosong.
        5. Selalu sebutkan harga saat merekomendasikan produk secara tekstual juga.
        6. Jawab dengan ringkas (maksimal 3-4 kalimat) dan dalam Bahasa Indonesia yang sopan.
        7. JANGAN selalu menyapa (Halo/Hai) di setiap pesan, kecuali di awal percakapan.

        Inventaris Apotek Saat Ini:
        ${productContext}

        Jawab pertanyaan terakhir user berdasarkan konteks di atas.
        `

        // 3. Generate Response
        console.log("Sending request to Gemini...")
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const chat = model.startChat({
            history: history || [],
        })

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`)
        const response = result.response.text()
        console.log("Gemini response received")

        return NextResponse.json({ response })

    } catch (error) {
        console.error("AI Chat Error:", error)

        return NextResponse.json(
            { error: "Gagal memproses pesan." },
            { status: 500 }
        )
    }
}
