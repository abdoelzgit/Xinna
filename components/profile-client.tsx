"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IconUser, IconMail, IconPhone, IconMapPin, IconCalendar, IconEdit, IconLoader2, IconCheck } from "@tabler/icons-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateCustomer } from "@/lib/actions/customer-actions"
import { Textarea } from "./ui/textarea"

const profileSchema = z.object({
    nama_pelanggan: z.string().min(2, "Nama minimal 2 karakter"),
    no_telp: z.string().min(10, "Nomor telepon tidak valid").optional().or(z.string().length(0)),
    alamat1: z.string().min(5, "Alamat minimal 5 karakter").optional().or(z.string().length(0)),
    kota1: z.string().min(2, "Kota minimal 2 karakter").optional().or(z.string().length(0)),
    propinsi1: z.string().min(2, "Provinsi minimal 2 karakter").optional().or(z.string().length(0)),
    kodepos1: z.string().min(5, "Kodepos minimal 5 karakter").optional().or(z.string().length(0)),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileClientProps {
    user: any
    initialData: any
    type: "customer" | "staff"
}

export function ProfileClient({ user, initialData, type }: ProfileClientProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nama_pelanggan: initialData?.nama_pelanggan || initialData?.name || "",
            no_telp: initialData?.no_telp || "",
            alamat1: initialData?.alamat1 || "",
            kota1: initialData?.kota1 || "",
            propinsi1: initialData?.propinsi1 || "",
            kodepos1: initialData?.kodepos1 || "",
        },
    })

    async function onSubmit(values: ProfileFormValues) {
        if (type !== "customer") return

        setIsSubmitting(true)
        try {
            const result = await updateCustomer(initialData.id, values)
            if (result.success) {
                toast.success("Profil diperbarui", {
                    description: "Informasi profil Anda telah berhasil disimpan."
                })
                setIsOpen(false)
            } else {
                toast.error("Gagal memperbarui profil", {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi nanti."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header / Cover */}
            <div className="relative h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-blue-500/10 rounded-3xl overflow-hidden border border-primary/10">
                <div className="absolute -bottom-12 left-8 flex items-end gap-6 w-full pr-16">
                    <Avatar className="size-32 border-4 border-white shadow-xl rounded-2xl shrink-0">
                        <AvatarFallback className="text-4xl bg-white text-primary font-bold">
                            {user.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="pb-4 flex-1 flex flex-col justify-end">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{initialData?.nama_pelanggan || user.name}</h1>
                            
                        </div>
                        <Badge variant="secondary" className="capitalize mt-1 w-fit">
                            {user.userType === 'customer' ? 'Pelanggan Terdaftar' : user.jabatan}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                {/* Sidebar Info */}
                <Card className="md:col-span-1 h-fit border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Informasi Kontak</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                                <IconMail className="size-3" /> Email
                            </p>
                            <p className="text-sm font-bold text-slate-900 truncate">{initialData?.email || user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                                <IconPhone className="size-3" /> Nomor Telepon
                            </p>
                            <p className="text-sm font-bold text-slate-900">{initialData?.no_telp || "Belum diatur"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex w-full justify-between">

                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Detail Akun</CardTitle>
                            {type === "customer" && (
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                     
                                            <IconEdit className="size-6 text-slate-600 hover:text-primary rounded-full " />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] rounded-3xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Edit Profile</DialogTitle>
                                            <DialogDescription>
                                                Perbarui informasi pribadi dan alamat pengiriman Anda.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="nama_pelanggan"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Nama Lengkap</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="John Doe" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="no_telp"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Nomor Telepon</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="08xxxxxxxxxx" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="alamat1"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Alamat Lengkap</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea placeholder="Jl. Raya No. 123" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <FormField
                                                        control={form.control}
                                                        name="kota1"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Kota</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Purwokerto" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="propinsi1"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Provinsi</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Jawa Tengah" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="kodepos1"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Kodepos</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="53111" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <DialogFooter className="pt-4 flex gap-2">
                                                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Batal</Button>
                                                    <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-slate-900 font-bold uppercase tracking-widest text-[10px] min-w-[120px]">
                                                        {isSubmitting ? <IconLoader2 className="size-4 animate-spin" /> : "Simpan Perubahan"}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            )}
                            </div>
                            <CardDescription className="text-xs font-medium italic">Informasi pribadi Anda di Xinna Apotek.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-start gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-primary/20 group">
                                <div className="size-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <IconMapPin className="size-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-950">Alamat Pengiriman</p>
                                    <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                        {initialData?.alamat1 ? (
                                            <>
                                                {initialData.alamat1}<br />
                                                {initialData.kota1}, {initialData.propinsi1} {initialData.kodepos1}
                                            </>
                                        ) : (
                                            <span className="text-slate-400 italic font-medium">Anda belum mengatur alamat pengiriman utama.</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-primary/20 group">
                                <div className="size-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <IconCalendar className="size-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-950">Member Sejak</p>
                                    <p className="text-sm text-slate-600 font-bold">
                                        {initialData?.created_at ? new Date(initialData.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Desember 2023"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
