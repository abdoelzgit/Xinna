"use client"

import * as React from "react"
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { addToCart } from "@/lib/actions/cart-actions"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface AddToCartProps {
    productId: string
    stock: number
}

export function AddToCart({ productId, stock }: AddToCartProps) {
    const [quantity, setQuantity] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    const handleIncrement = () => {
        if (quantity < stock) {
            setQuantity(prev => prev + 1)
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const handleAddToCart = async () => {
        if (!session) {
            toast.error("Silakan login terlebih dahulu", {
                description: "Anda harus login sebagai pelanggan untuk berbelanja.",
                action: {
                    label: "Login",
                    onClick: () => router.push("/login")
                }
            })
            return
        }

        if ((session.user as any).userType !== "customer") {
            toast.error("Akses Ditolak", {
                description: "Hanya akun pelanggan yang dapat menambahkan item ke keranjang."
            })
            return
        }

        setIsLoading(true)
        try {
            const result = await addToCart(productId, quantity)
            if (result.success) {
                toast.success("Berhasil!", {
                    description: `${quantity} item telah ditambahkan ke keranjang.`
                })
                router.refresh()
            }
        } catch (error: any) {
            console.error("Cart Error:", error)
            let message = "Gagal menambahkan item ke keranjang."

            if (error.message === "INSUFFICIENT_STOCK") {
                message = "Stok tidak mencukupi."
            } else if (error.message === "INSUFFICIENT_STOCK_TOTAL") {
                message = "Total item di keranjang melebihi stok yang tersedia."
            }

            toast.error("Oops!", { description: message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-white shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-xl hover:bg-slate-50"
                        onClick={handleDecrement}
                        disabled={quantity <= 1 || isLoading}
                    >
                        <Minus className="size-4" />
                    </Button>
                    <span className="w-12 text-center font-black text-lg text-slate-900">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-xl hover:bg-slate-50"
                        onClick={handleIncrement}
                        disabled={quantity >= stock || isLoading}
                    >
                        <Plus className="size-4" />
                    </Button>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                    Sisa {stock} Unit
                </span>
            </div>

            <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/20 group"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                    <ShoppingCart className="mr-2 size-5 transition-transform group-hover:scale-110" />
                )}
                {isLoading ? "Memproses..." : "Tambahkan Ke Keranjang"}
            </Button>
        </div>
    )
}
