"use client"

import Link from "next/link"
import Image from "next/image"
import { Pill as PillIcon, ShoppingCart } from "lucide-react"

interface ProductCardProps {
    product: {
        id: string
        hashedId: string
        nama_obat: string
        harga_jual: number
        foto1?: string
        stok: number
        jenis_obat?: {
            jenis: string
        }
    }
}

export function ProductCard({ product: item }: ProductCardProps) {
    return (
        <div className="group flex flex-col space-y-6 relative">
            <Link
                href={`/medicine/${item.hashedId}`}
                className="aspect-[4/5] bg-slate-50 border border-slate-100 overflow-hidden relative transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem]"
            >
                {item.foto1 ? (
                    <Image
                        src={item.foto1}
                        alt={item.nama_obat}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-white">
                        <PillIcon className="h-24 w-24 text-slate-200" />
                    </div>
                )}

                {item.stok <= 5 && (
                    <div className="absolute top-6 left-6 z-10">
                        <div className="bg-white/90 backdrop-blur-md text-red-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-red-100">
                            Low Stock
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                    <button className="bg-white text-primary size-14 rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 hover:bg-primary hover:text-white">
                        <ShoppingCart className="size-6" />
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col space-y-3 px-2">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">
                        {item.jenis_obat?.jenis || "Umum"}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                <div className="flex flex-col space-y-1">
                    <h3 className="text-xl font-bold tracking-tight leading-tight text-primary cursor-pointer">
                        <Link href={`/medicine/${item.hashedId}`}>{item.nama_obat}</Link>
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <p className="text-2xl font-black text-black tracking-tighter">
                        Rp {new Intl.NumberFormat('id-ID').format(item.harga_jual)}
                    </p>
                    <button className="text-slate-400 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest border-b border-transparent hover:border-primary">
                        Details
                    </button>
                </div>
            </div>
        </div>
    )
}
