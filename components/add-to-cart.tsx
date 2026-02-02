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
            toast.error("Please login first", {
                description: "You must login as a customer to shop.",
                action: {
                    label: "Login",
                    onClick: () => router.push("/login")
                }
            })
            return
        }

        if ((session.user as any).userType !== "customer") {
            toast.error("Access Denied", {
                description: "Only customer accounts can add items to the cart."
            })
            return
        }

        setIsLoading(true)
        try {
            const result = await addToCart(productId, quantity)
            if (result.success) {
                toast.success("Success!", {
                    description: `${quantity} ${quantity === 1 ? 'item has' : 'items have'} been added to your cart.`
                })
                router.refresh()
            }
        } catch (error: any) {
            console.error("Cart Error:", error)
            let message = "Failed to add item to cart."

            if (error.message === "INSUFFICIENT_STOCK") {
                message = "Insufficient stock."
            } else if (error.message === "INSUFFICIENT_STOCK_TOTAL") {
                message = "Total item in cart exceeds available stock."
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
                    {stock} units left
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
                {isLoading ? "Processing..." : "Add to Cart"}
            </Button>
        </div>
    )
}
