import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    Pill as PillIcon,
    Truck,
    ArrowLeftRight,
    RotateCcw,
    ChevronDown,
    Plus,
    Minus,
    ShoppingCart,
    Info
} from "lucide-react";
import { getProductById } from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCart } from "@/components/add-to-cart";

interface MedicinePageProps {
    params: {
        id: string;
    };
}

export default async function MedicinePage({ params }: MedicinePageProps) {
    const { id } = await params
    const product = await getProductById(id)
    if (!product) {
        notFound();
    }

    return (
        <div className="bg-white text-slate-900 font-sans selection:bg-primary selection:text-white">
            <main className="container px-4 md:px-8 py-12 md:py-20 mx-auto">
                {/* Breadcrumb / Back button could go here */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Product Info & Details */}
                    <div className="lg:col-span-3 space-y-10 order-2 lg:order-1">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-slate-950">
                                {product.nama_obat}
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {product.deskripsi_obat || "Tidak ada deskripsi tersedia untuk produk ini. Silakan hubungi apoteker kami untuk informasi lebih lanjut mengenai penggunaan dan dosis."}
                            </p>
                        </div>

                        {/* Accordion Sections (Custom implementation to match reference) */}
                        <div className="space-y-2 border-t border-slate-100 pt-6">
                            <details className="group" open>
                                <summary className="flex items-center justify-between cursor-pointer list-none py-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Informasi Produk</span>
                                    <Minus className="size-3 text-slate-400 group-open:block hidden" />
                                    <Plus className="size-3 text-slate-400 group-open:hidden block" />
                                </summary>
                                <div className="pb-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Stok</span>
                                        <span className="block text-xs font-bold text-slate-900">{product.stok} unit</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Kategori</span>
                                        <span className="block text-xs font-bold text-slate-900">{product.jenis_obat?.jenis || "Tanpa Kategori"}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Status</span>
                                        <span className="block text-xs font-bold text-slate-900">
                                            {product.stok > 0 ? (
                                                <span className="text-green-600">Tersedia</span>
                                            ) : (
                                                <span className="text-red-600">Habis</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Tipe</span>
                                        <span className="block text-xs font-bold text-slate-900">Tablet / Kapsul</span>
                                    </div>
                                </div>
                            </details>

                            <details className="group border-t border-slate-100">
                                <summary className="flex items-center justify-between cursor-pointer list-none py-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Pengiriman & Layanan</span>
                                    <Minus className="size-3 text-slate-400 group-open:block hidden" />
                                    <Plus className="size-3 text-slate-400 group-open:hidden block" />
                                </summary>
                                <div className="pb-8 space-y-6">
                                    <div className="flex gap-4">
                                        <Truck className="size-5 text-slate-950 shrink-0" />
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-900">Pengiriman Cepat</span>
                                            <p className="text-[11px] font-medium text-slate-400 leading-normal">Paket Anda akan tiba dalam 1-3 jam untuk area lokal via kurir apotek kami.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <ArrowLeftRight className="size-5 text-slate-950 shrink-0" />
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-900">Tukar Kemasan</span>
                                            <p className="text-[11px] font-medium text-slate-400 leading-normal">Kemasan rusak? Tenang, kami akan menukarnya dengan yang baru secara instan.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <RotateCcw className="size-5 text-slate-950 shrink-0" />
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-900">Retur Mudah</span>
                                            <p className="text-[11px] font-medium text-slate-400 leading-normal">Salah beli? Kembalikan produk dan kami akan mengembalikan dana Anda sepenuhnya.</p>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>

                    {/* Center Column: Product Image Gallery */}
                    <div className="lg:col-span-6 order-1 lg:order-2">
                        <ProductGallery
                            images={[product.foto1, product.foto2, product.foto3]}
                            alt={product.nama_obat}
                        />
                    </div>

                    {/* Right Column: Pricing & Actions */}
                    <div className="lg:col-span-3 space-y-10 order-3 lg:pt-4">
                        <div className="space-y-1">
                            <p className="text-5xl font-black text-slate-950 tracking-tighter italic leading-none">
                                Rp {new Intl.NumberFormat('id-ID').format(product.harga_jual)}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {product.stok > 0 ? (
                                <AddToCart
                                    productId={product.hashedId}
                                    stock={product.stok}
                                />
                            ) : (
                                <Button disabled className="w-full h-16 rounded-[1.5rem] bg-slate-100 text-slate-400 font-black uppercase tracking-[0.2em] text-[11px]">
                                    Out of Stock
                                </Button>
                            )}
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex gap-4 items-start">
                            <Info className="size-5 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <span className="block text-[11px] font-black uppercase tracking-tight text-slate-950">Konsultasi Gratis</span>
                                <p className="text-[11px] font-medium text-slate-500 leading-normal">Butuh rekomendasi atau panduan penggunaan? Chat apoteker kami 24/7.</p>
                            </div>
                        </div>

                        {/* Additional Info Cards or Badges could go here */}
                    </div>

                </div>
            </main>
        </div>
    );
}
