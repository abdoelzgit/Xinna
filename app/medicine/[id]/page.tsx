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
                            <h1 className="text-2xl md:text-4xl font-black tracking-tighter leading-[0.9] text-primary">
                                {product.nama_obat}
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {product.deskripsi_obat || "No description available for this product. Please contact our pharmacist for more information regarding usage and dosage."}
                            </p>
                        </div>

                        {/* Accordion Sections (Custom implementation to match reference) */}
                        <div className="space-y-2 border-t border-slate-100 pt-6">
                            <details className="group" open>
                                <summary className="flex items-center justify-between cursor-pointer list-none py-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Product Information</span>
                                    <Minus className="size-3 text-slate-400 group-open:block hidden" />
                                    <Plus className="size-3 text-slate-400 group-open:hidden block" />
                                </summary>
                                <div className="pb-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Stock</span>
                                        <span className="block text-xs font-bold text-slate-900">{product.stok} unit</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Category</span>
                                        <span className="block text-xs font-bold text-slate-900">{product.jenis_obat?.jenis || "No Category"}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Status</span>
                                        <span className="block text-xs font-bold text-slate-900">
                                            {product.stok > 0 ? (
                                                <span className="text-green-600">Available</span>
                                            ) : (
                                                <span className="text-red-600">Out of Stock</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-tighter text-slate-400">Type</span>
                                        <span className="block text-xs font-bold text-slate-900">Tablet / Capsule</span>
                                    </div>
                                </div>
                            </details>

                            <details className="group border-t border-slate-100">
                                <summary className="flex items-center justify-between cursor-pointer list-none py-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Shipping & Services</span>
                                    <Minus className="size-3 text-slate-400 group-open:block hidden" />
                                    <Plus className="size-3 text-slate-400 group-open:hidden block" />
                                </summary>
                                <div className="pb-8 space-y-6">
                                    <div className="flex gap-4">
                                        <Truck className="size-5 text-primary shrink-0" />
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-900">Fast Delivery</span>
                                            <p className="text-[11px] font-medium text-slate-400 leading-normal">Your package will arrive in 1-3 hours for local areas via our pharmacy courier.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <ArrowLeftRight className="size-5 text-primary shrink-0" />
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-900">Packaging Swap</span>
                                            <p className="text-[11px] font-medium text-slate-400 leading-normal">Damaged packaging? No worries, we'll swap it for a new one instantly.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <RotateCcw className="size-5 text-primary shrink-0" />
                                        <div className="space-y-1">
                                            <span className="block text-[11px] font-black uppercase tracking-tight text-slate-900">Easy Returns</span>
                                            <p className="text-[11px] font-medium text-slate-400 leading-normal">Wrong purchase? Return the product and we will refund your money in full.</p>
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
                            <p className="text-4xl font-black text-black tracking-tighter italic leading-none">
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
                                <span className="block text-[11px] font-black uppercase tracking-tight text-primary">Free Consultation</span>
                                <p className="text-[11px] font-medium text-slate-500 leading-normal">Need a recommendation or usage guide? Chat with our pharmacist 24/7.</p>
                            </div>
                        </div>

                        {/* Additional Info Cards or Badges could go here */}
                    </div>

                </div>
            </main>
        </div>
    );
}
