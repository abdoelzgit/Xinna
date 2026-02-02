"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Loader2, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { updateCartQuantity, removeFromCart } from "@/lib/actions/cart-actions"
import { useRouter } from "next/navigation"

interface CartItem {
    id: string
    id_pelanggan: string
    id_obat: string
    jumlah_beli: number
    harga_beli: number
    subtotal: number
    obat: {
        id: string
        nama_obat: string
        foto1: string | null
        stok: number
    }
}

interface CartClientProps {
    initialItems: CartItem[]
}

export function CartClient({ initialItems }: CartClientProps) {
    const [items, setItems] = React.useState(initialItems)
    const [isUpdating, setIsUpdating] = React.useState<string | null>(null)
    const router = useRouter()

    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0)
    const shipping = items.length > 0 ? 5000 : 0
    const tax = subtotal * 0.11 // PPN 11%
    const total = subtotal + shipping + tax

    const handleQuantityChange = async (cartId: string, newQuantity: number) => {
        setIsUpdating(cartId)
        try {
            await updateCartQuantity(cartId, newQuantity)
            setItems(prev => prev.map(item =>
                item.id === cartId
                    ? { ...item, jumlah_beli: newQuantity, subtotal: item.harga_beli * newQuantity }
                    : item
            ))
            toast.success("Cart updated")
        } catch (error: any) {
            toast.error("Failed to update quantity")
        } finally {
            setIsUpdating(null)
            router.refresh()
        }
    }

    const handleRemove = async (cartId: string) => {
        setIsUpdating(cartId)
        try {
            await removeFromCart(cartId)
            setItems(prev => prev.filter(item => item.id !== cartId))
            toast.success("Product removed from cart")
        } catch (error) {
            toast.error("Failed to remove product")
        } finally {
            setIsUpdating(null)
            router.refresh()
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center">
                    <ShoppingBag className="size-12 text-slate-200" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black tracking-tight">Empty Cart</h2>
                    <p className="text-slate-500 max-w-xs mx-auto">It looks like you haven't added any products to your cart yet.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 px-8 font-bold uppercase tracking-widest text-[11px]">
                    <Link href="/">Shop Now</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Cart</h1>
                    <p className="text-slate-400 text-sm font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="border-t border-slate-100">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Item</th>
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Quantity</th>
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Price</th>
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative size-24 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden shrink-0">
                                                {item.obat.foto1 ? (
                                                    <Image
                                                        src={item.obat.foto1}
                                                        alt={item.obat.nama_obat}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center text-slate-200">
                                                        <ShoppingBag />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <Link
                                                    href={`/medicine/${item.id_obat}`}
                                                    className="font-black text-slate-900 group-hover:text-primary transition-colors leading-tight block"
                                                >
                                                    {item.obat.nama_obat}
                                                </Link>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                                    Original Product
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8">
                                        <div className="flex items-center justify-center gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-10 rounded-xl text-slate-400 hover:text-destructive shrink-0"
                                                onClick={() => handleRemove(item.id)}
                                                disabled={isUpdating === item.id}
                                            >
                                                {isUpdating === item.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                            </Button>
                                            <Select
                                                value={item.jumlah_beli.toString()}
                                                onValueChange={(val) => handleQuantityChange(item.id, parseInt(val))}
                                                disabled={isUpdating === item.id}
                                            >
                                                <SelectTrigger className="w-20 rounded-xl font-bold bg-slate-50 border-none">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl font-bold">
                                                    {[...Array(Math.min(item.obat.stok, 10))].map((_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </td>
                                    <td className="py-8 text-right">
                                        <span className="font-bold text-slate-500">
                                            Rp {new Intl.NumberFormat('id-ID').format(item.harga_beli)}
                                        </span>
                                    </td>
                                    <td className="py-8 text-right">
                                        <span className="font-black text-primary">
                                            Rp {new Intl.NumberFormat('id-ID').format(item.subtotal)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-24">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Summary</h2>
                    <Link href="#" className="text-xs font-black uppercase tracking-widest text-primary hover:underline block">
                        Add Promotion Code(s)
                    </Link>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtotal</span>
                        <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping</span>
                        <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Taxes (PPN 11%)</span>
                        <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(tax)}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Total</span>
                        <span className="text-2xl font-black tracking-tighter text-primary italic">
                            Rp {new Intl.NumberFormat('id-ID').format(total)}
                        </span>
                    </div>
                </div>

                <Button asChild className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/20 group">
                    <Link href="/checkout">
                        Go to checkout
                        <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
