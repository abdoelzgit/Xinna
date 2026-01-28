"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group"
import { createOrder } from "@/lib/actions/checkout-actions"

const checkoutSchema = z.object({
    firstName: z.string().min(1, "Nama depan wajib diisi"),
    lastName: z.string().min(1, "Nama belakang wajib diisi"),
    address: z.string().min(5, "Alamat lengkap wajib diisi"),
    city: z.string().min(1, "Kota wajib diisi"),
    province: z.string().min(1, "Provinsi wajib diisi"),
    postalCode: z.string().min(5, "Kodepos wajib diisi"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(10, "Nomor telepon tidak valid"),
    shippingMethod: z.string().min(1, "Pilih metode pengiriman"),
    paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
})

interface CheckoutClientProps {
    cartItems: any[]
    pelanggan: any
    metodeBayar: any[]
    jenisPengiriman: any[]
}

export function CheckoutClient({ cartItems, pelanggan, metodeBayar, jenisPengiriman }: CheckoutClientProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [activeStep, setActiveStep] = React.useState<"address" | "delivery" | "payment">("address")
    const router = useRouter()

    const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0)
    const [shippingCost, setShippingCost] = React.useState(0)
    const tax = subtotal * 0.11
    const total = subtotal + shippingCost + tax

    const form = useForm<z.infer<typeof checkoutSchema>>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: pelanggan?.nama_pelanggan?.split(" ")[0] || "",
            lastName: pelanggan?.nama_pelanggan?.split(" ").slice(1).join(" ") || "",
            address: pelanggan?.alamat1 || "",
            city: pelanggan?.kota1 || "",
            province: pelanggan?.propinsi1 || "",
            postalCode: pelanggan?.kodepos1 || "",
            email: pelanggan?.email || "",
            phone: pelanggan?.no_telp || "",
            shippingMethod: "",
            paymentMethod: "",
        },
    })

    const watchAll = form.watch()
    const selectedShipping = jenisPengiriman.find(m => m.id.toString() === watchAll.shippingMethod)
    const selectedPayment = metodeBayar.find(m => m.id.toString() === watchAll.paymentMethod)

    const handleNextStep = async (step: "delivery" | "payment") => {
        const fieldsToValidate = step === "delivery"
            ? ["firstName", "lastName", "address", "city", "province", "postalCode", "email", "phone"]
            : ["shippingMethod"]

        const isValid = await form.trigger(fieldsToValidate as any)
        if (isValid) {
            setActiveStep(step)
        }
    }

    const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
        setIsSubmitting(true)
        try {
            const result = await createOrder({
                id_metode_bayar: values.paymentMethod,
                id_jenis_kirim: values.shippingMethod,
                ongkos_kirim: shippingCost,
                biaya_app: 0,
                shipping_address: {
                    nama: `${values.firstName} ${values.lastName}`,
                    telp: values.phone,
                    alamat: values.address,
                    kota: values.city,
                    propinsi: values.province,
                    kodepos: values.postalCode
                }
            })

            if (result.success) {
                toast.success("Pesanan Berhasil!", {
                    description: "Pesanan Anda sedang kami proses."
                })
                router.push(`/profile`)
            }
        } catch (error: any) {
            toast.error("Gagal membuat pesanan", {
                description: error.message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Forms */}
            <div className="lg:col-span-8 space-y-12">
                <Link href="/cart" className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 size-3" />
                    Back to shopping cart
                </Link>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                        {/* 1. Shipping Address */}
                        <section className="space-y-8 border-b border-slate-100 pb-12">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2 text-primary">
                                    Shipping Address {activeStep !== "address" && <CheckCircle2 className="size-5 text-primary" />}
                                </h2>
                                {activeStep !== "address" && (
                                    <Button variant="link" type="button" onClick={() => setActiveStep("address")} className="text-primary font-bold uppercase tracking-widest text-[10px]">Edit</Button>
                                )}
                            </div>

                            {activeStep === "address" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="firstName" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">First Name</FormLabel>
                                            <FormControl><Input placeholder="ABDUL" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="lastName" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Last Name</FormLabel>
                                            <FormControl><Input placeholder="AZIZ" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="md:col-span-2">
                                        <FormField control={form.control} name="address" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Address</FormLabel>
                                                <FormControl><Input placeholder="Jalan Brigade No.17" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="postalCode" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Postal Code</FormLabel>
                                            <FormControl><Input placeholder="53151" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="city" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">City</FormLabel>
                                            <FormControl><Input placeholder="Purwokerto" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="province" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Province</FormLabel>
                                            <FormControl><Input placeholder="Jawa Tengah" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Email</FormLabel>
                                            <FormControl><Input placeholder="admin@xinna.com" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Phone</FormLabel>
                                            <FormControl><Input placeholder="08123456789" className="rounded-xl bg-slate-50 border-none h-12 font-bold px-4" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="md:col-span-2 pt-4">
                                        <Button type="button" onClick={() => handleNextStep("delivery")} className="h-12 px-8 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all">Continue to delivery</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px] font-bold text-slate-900">
                                    <div className="space-y-2">
                                        <p className="text-slate-400 uppercase tracking-widest text-[10px]">Shipping Address</p>
                                        <p className="uppercase">{watchAll.firstName} {watchAll.lastName}</p>
                                        <p>{watchAll.address}</p>
                                        <p>{watchAll.postalCode}, {watchAll.city}</p>
                                        <p>ID</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-400 uppercase tracking-widest text-[10px]">Contact</p>
                                        <p>{watchAll.phone}</p>
                                        <p>{watchAll.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-400 uppercase tracking-widest text-[10px]">Billing Address</p>
                                        <p className="text-slate-500 font-medium italic lowercase">Billing and delivery address are the same.</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 2. Delivery */}
                        <section className="space-y-8 border-b border-slate-100 pb-12">
                            <div className="flex justify-between items-center">
                                <h2 className={`text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2 ${activeStep === "address" ? "opacity-20" : "text-primary"}`}>
                                    Delivery {activeStep === "payment" && <CheckCircle2 className="size-5 text-primary" />}
                                </h2>
                                {activeStep === "payment" && (
                                    <Button variant="link" type="button" onClick={() => setActiveStep("delivery")} className="text-primary font-bold uppercase tracking-widest text-[10px]">Edit</Button>
                                )}
                            </div>

                            {activeStep === "delivery" && (
                                <div className="space-y-6">
                                    <FormField control={form.control} name="shippingMethod" render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormControl>
                                                <RadioGroup onValueChange={(val) => { field.onChange(val); setShippingCost(5000); }} defaultValue={field.value} className="grid grid-cols-1 gap-4">
                                                    {jenisPengiriman.map((method) => (
                                                        <FormItem key={method.id.toString()} className="flex items-center space-x-3 space-y-0 rounded-2xl border p-6 hover:bg-slate-50 transition-colors cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                                            <FormControl><RadioGroupItem value={method.id.toString()} /></FormControl>
                                                            <div className="space-y-1">
                                                                <FormLabel className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none">{method.jenis_kirim}</FormLabel>
                                                                <span className="block text-[10px] font-medium text-slate-400">{method.nama_ekspedisi} • Est. 1-2 Hours</span>
                                                            </div>
                                                            <span className="ml-auto font-black text-xs italic">Rp 5.000</span>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="button" onClick={() => handleNextStep("payment")} className="h-12 px-8 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all">Continue to payment</Button>
                                </div>
                            )}

                            {activeStep === "payment" && selectedShipping && (
                                <div className="text-[11px] font-bold text-slate-900">
                                    <p className="text-slate-400 uppercase tracking-widest text-[10px] mb-2">Method</p>
                                    <p className="uppercase">{selectedShipping.jenis_kirim} - Rp 5.000</p>
                                </div>
                            )}
                        </section>

                        {/* 3. Payment */}
                        <section className="space-y-8">
                            <h2 className={`text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2 ${activeStep !== "payment" ? "opacity-20" : "text-primary"}`}>
                                Payment
                            </h2>
                            {activeStep === "payment" && (
                                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4">
                                                {metodeBayar.map((method) => (
                                                    <FormItem key={method.id.toString()} className="flex flex-col items-start gap-3 space-y-0 rounded-2xl border p-6 hover:bg-slate-50 transition-colors cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                                        <div className="flex items-center gap-3">
                                                            <FormControl><RadioGroupItem value={method.id.toString()} /></FormControl>
                                                            <FormLabel className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none">{method.metode_pembayaran}</FormLabel>
                                                        </div>
                                                        <div className="pl-7 space-y-1 text-[10px] font-medium text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                                            <div className="size-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                                <CheckCircle2 className="size-4" />
                                                            </div>
                                                            Another step may appear
                                                        </div>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}
                        </section>
                    </form>
                </Form>
            </div>

            {/* Right: Cart Summary */}
            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-24">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic text-primary">In your Cart</h2>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100 italic">
                    <div className="flex justify-between items-center ">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Subtotal</span>
                        <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping</span>
                        <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Taxes</span>
                        <span className="font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(tax)}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center not-italic">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Total</span>
                        <span className="text-2xl font-black tracking-tighter text-primary italic">
                            Rp {new Intl.NumberFormat('id-ID').format(total)}
                        </span>
                    </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center group">
                            <div className="relative size-16 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0">
                                {item.obat.foto1 ? (
                                    <Image src={item.obat.foto1} alt={item.obat.nama_obat} fill className="object-cover" />
                                ) : (
                                    <div className="size-full bg-slate-100 animate-pulse" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black uppercase tracking-tight text-slate-900 truncate">{item.obat.nama_obat}</p>
                                <p className="text-[10px] font-medium text-slate-400 tracking-tight">{item.jumlah_beli}x Rp {new Intl.NumberFormat('id-ID').format(item.harga_beli)}</p>
                            </div>
                            <span className="text-[11px] font-black text-slate-950">Rp {new Intl.NumberFormat('id-ID').format(item.subtotal)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-6 pt-4">
                    <Link href="#" className="text-xs font-black uppercase tracking-widest text-primary hover:underline block">
                        Add Promotion Code(s)
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting || activeStep !== "payment" || !form.formState.isValid}
                        onClick={form.handleSubmit(onSubmit)}
                        className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/20 group disabled:opacity-30"
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 size-5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="mr-2 size-5 transition-transform group-hover:scale-110" />
                        )}
                        {isSubmitting ? "Processing..." : "Submit My Order"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
