"use client"

import * as React from "react"
import {
    IconPlus,
    IconSearch,
    IconTruckDelivery,
    IconCalendar,
    IconUser,
    IconNote,
    IconLoader2,
    IconPackage
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createShipping } from "@/lib/actions/shipping-actions"

const shippingSchema = z.object({
    id_penjualan: z.string().min(1, "Pilih pesanan yang akan dikirim"),
    tgl_pengiriman: z.string().min(1, "Tanggal pengiriman wajib diisi"),
    keterangan: z.string().optional()
})

type ShippingFormValues = z.infer<typeof shippingSchema>

interface ShippingsClientProps {
    shippings: any[]
    pendingSales: any[]
}

export function ShippingsClient({ shippings: initialShippings, pendingSales: initialPendingSales }: ShippingsClientProps) {
    const [shippings, setShippings] = React.useState(initialShippings)
    const [pendingSales, setPendingSales] = React.useState(initialPendingSales)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            id_penjualan: "",
            tgl_pengiriman: new Date().toISOString().split('T')[0],
            keterangan: ""
        }
    })

    const filteredShippings = shippings.filter(s =>
        s.penjualan?.id.toString().includes(searchTerm) ||
        s.penjualan?.pelanggan?.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function onSubmit(values: ShippingFormValues) {
        setIsSubmitting(true)
        try {
            const payload = {
                ...values,
                tgl_pengiriman: new Date(values.tgl_pengiriman)
            }

            const result = await createShipping(payload)
            if (result.success) {
                toast.success("Catatan pengiriman berhasil dibuat")
                // In real app, we might want to refresh data from server instead of manual state management for complex relations
                window.location.reload()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Log Pengiriman</h2>
                    <p className="text-muted-foreground text-sm font-medium">Pantau dan catat riwayat pengiriman barang ke pelanggan.</p>
                </div>

                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-64">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Cari Order ID / Pelanggan..."
                            className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-lg bg-black hover:bg-black/90">
                                <IconPlus className="size-4" />
                                Catat Pengiriman
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Tambah Log Pengiriman</DialogTitle>
                                <DialogDescription className="text-xs font-medium italic">Pilih pesanan yang siap dikirim dan masukkan detailnya.</DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                                    <FormField
                                        control={form.control}
                                        name="id_penjualan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Pesanan (Order ID)</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl bg-slate-50 border-none h-12 font-bold">
                                                            <SelectValue placeholder="Pilih Pesanan yang Belum Dikirim" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-2xl max-h-[300px]">
                                                        {pendingSales.length === 0 ? (
                                                            <div className="p-4 text-center text-xs text-slate-400 italic">Tidak ada pesanan tertunda</div>
                                                        ) : (
                                                            pendingSales.map(sale => (
                                                                <SelectItem key={sale.id} value={sale.id}>
                                                                    ID: {sale.id} - {sale.pelanggan?.nama_pelanggan}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="tgl_pengiriman"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal Pengiriman</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" className="rounded-xl bg-slate-50 border-none h-12 font-bold" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="keterangan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Keterangan / Nomor Resi</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Contoh: Resi JNE: 12345678, atau Diantar Kurir Internal" className="rounded-xl bg-slate-50 border-none h-12 font-bold" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <DialogFooter className="pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Batal</Button>
                                        <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 h-12 px-8 font-bold uppercase tracking-widest text-[10px] min-w-[150px] shadow-lg shadow-black text-white">
                                            {isSubmitting ? <IconLoader2 className="size-4 animate-spin" /> : "Simpan Log"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Order ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Pelanggan</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Tgl Pengiriman</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Keterangan / Resi</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Petugas (Staff)</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Kurir</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredShippings.map((ship) => (
                            <TableRow key={ship.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                <TableCell className="font-bold text-slate-900 italic">#{ship.id_penjualan}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">{ship.penjualan?.pelanggan?.nama_pelanggan}</span>
                                        <span className="text-[10px] text-slate-400 font-medium italic">{ship.penjualan?.pelanggan?.no_telp}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-xs ring-1 ring-slate-100 w-fit px-3 py-1.5 rounded-lg bg-slate-50">
                                        <IconCalendar className="size-3 text-slate-400" />
                                        {new Date(ship.tgl_pengiriman).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <IconNote className="size-3.5 text-emerald-500 shrink-0" />
                                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">
                                            {ship.keterangan || "Tanpa keterangan"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold uppercase italic">
                                            {ship.user?.name.charAt(0)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">{ship.user?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none text-[9px] uppercase tracking-wider px-2.5 py-1">
                                        {ship.penjualan?.jenis_pengiriman?.nama_ekspedisi}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredShippings.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="size-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-4">
                            <IconTruckDelivery className="size-8 text-indigo-400" />
                        </div>
                        <h3 className="font-black uppercase tracking-tighter text-slate-800">Riwayat Pengiriman Kosong</h3>
                        <p className="text-slate-400 text-sm font-medium italic max-w-xs mx-auto">Klik tombol "Catat Pengiriman" untuk mulai mendokumentasikan proses delivery.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
