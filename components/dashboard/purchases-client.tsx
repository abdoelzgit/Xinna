"use client"

import * as React from "react"
import {
    IconPlus,
    IconSearch,
    IconEye,
    IconTrash,
    IconCalendar,
    IconBuildingStore,
    IconPills,
    IconX,
    IconLoader2
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useForm, useFieldArray } from "react-hook-form"
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
import { createPurchase, deletePurchase } from "@/lib/actions/purchase-actions"

const purchaseSchema = z.object({
    nonota: z.string().min(1, "Nomor nota wajib diisi"),
    tgl_pembelian: z.string().min(1, "Tanggal wajib diisi"),
    id_distributor: z.string().min(1, "Distributor wajib dipilih"),
    items: z.array(z.object({
        id_obat: z.string().min(1, "Obat wajib dipilih"),
        jumlah_beli: z.number().min(1, "Minimal 1"),
        harga_beli: z.number().min(1, "Harga wajib diisi"),
    })).min(1, "Minimal 1 obat")
})

type PurchaseFormValues = z.infer<typeof purchaseSchema>

interface PurchasesClientProps {
    purchases: any[]
    distributors: any[]
    medicines: any[]
}

export function PurchasesClient({ purchases: initialPurchases, distributors, medicines }: PurchasesClientProps) {
    const [purchases, setPurchases] = React.useState(initialPurchases)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedPurchase, setSelectedPurchase] = React.useState<any>(null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {
            nonota: "",
            tgl_pembelian: new Date().toISOString().split('T')[0],
            id_distributor: "",
            items: [{ id_obat: "", jumlah_beli: 1, harga_beli: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    const filteredPurchases = purchases.filter(p =>
        p.nonota.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.distributor?.nama_distributor.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const calculateTotal = (items: any[]) => {
        return items.reduce((acc, item) => acc + (item.jumlah_beli * item.harga_beli), 0)
    }

    async function onSubmit(values: PurchaseFormValues) {
        setIsSubmitting(true)
        try {
            const payload = {
                ...values,
                tgl_pembelian: new Date(values.tgl_pembelian),
                total_bayar: calculateTotal(values.items),
                items: values.items.map(item => ({
                    ...item,
                    subtotal: item.jumlah_beli * item.harga_beli
                }))
            }

            const result = await createPurchase(payload)
            if (result.success) {
                toast.success("Pembelian berhasil dicatat", {
                    description: "Stok obat telah otomatis bertambah."
                })
                setPurchases(prev => [result.data, ...prev])
                setIsOpen(false)
                form.reset()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsSubmitting(true)
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus data pembelian ini? (Stok tidak akan berkurang otomatis)")) return

        try {
            const result = await deletePurchase(id)
            if (result.success) {
                toast.success("Data dihapus")
                setPurchases(prev => prev.filter(p => p.id !== id))
            }
        } catch (error) {
            toast.error("Gagal menghapus")
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Pembelian</h2>
                    <p className="text-muted-foreground text-sm font-medium">Catat stok masuk dari distributor ke apotek.</p>
                </div>

                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-64">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Cari nota/distributor..."
                            className="pl-10 rounded-xl bg-slate-50 border-none h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2">
                                <IconPlus className="size-4" />
                                Tambah Pembelian
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Entry Pembelian Baru</DialogTitle>
                                <DialogDescription className="text-xs font-medium italic">Isi detail nota dan barang untuk menambah stok.</DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="nonota"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Nota</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="NOTA-001" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tgl_pembelian"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" className="rounded-xl bg-slate-50 border-none h-11 font-bold" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="id_distributor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distributor</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11 font-bold">
                                                                <SelectValue placeholder="Pilih Distributor" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-2xl">
                                                            {distributors.map(d => (
                                                                <SelectItem key={d.id} value={d.id}>{d.nama_distributor}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daftar Obat</h4>
                                            <Button type="button" variant="outline" size="sm" onClick={() => append({ id_obat: "", jumlah_beli: 1, harga_beli: 0 })} className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2">
                                                <IconPlus className="size-3" /> Tambah Baris
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-slate-50 relative group">
                                                    <div className="flex-1">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.id_obat`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger className="rounded-xl bg-white border-slate-100 h-11 font-bold text-xs">
                                                                                <SelectValue placeholder="Pilih Obat" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent className="rounded-2xl">
                                                                            {medicines.map(m => (
                                                                                <SelectItem key={m.id} value={m.id}>{m.nama_obat} (Stok: {m.stok})</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="w-full md:w-32">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.jumlah_beli`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Qty"
                                                                            className="rounded-xl bg-white border-slate-100 h-11 font-bold text-xs"
                                                                            {...field}
                                                                            onChange={e => field.onChange(parseInt(e.target.value))}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="w-full md:w-48">
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.harga_beli`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Harga"
                                                                            className="rounded-xl bg-white border-slate-100 h-11 font-bold text-xs"
                                                                            {...field}
                                                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="rounded-xl text-rose-500 hover:bg-rose-50">
                                                            <IconX className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-slate-900 text-white flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest opacity-60">Total Pembayaran</span>
                                        <span className="text-2xl font-black italic tracking-tighter">
                                            {formatCurrency(calculateTotal(form.watch("items") || []))}
                                        </span>
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Batal</Button>
                                        <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary h-12 px-8 font-bold uppercase tracking-widest text-[10px] min-w-[150px]">
                                            {isSubmitting ? <IconLoader2 className="size-4 animate-spin text-white" /> : "Simpan Pembelian"}
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
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Nota</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Distributor</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Tanggal</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Total</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Items</TableHead>
                            <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest py-5 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPurchases.map((purchase) => (
                            <TableRow key={purchase.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                <TableCell className="font-bold text-slate-900">{purchase.nonota}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">{purchase.distributor?.nama_distributor}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{purchase.distributor?.telepon}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-slate-600">
                                    {new Date(purchase.tgl_pembelian).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="font-black text-slate-900">{formatCurrency(Number(purchase.total_bayar))}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="rounded-lg text-[10px] font-bold">{purchase.details?.length || 0} Item</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setSelectedPurchase(purchase)}>
                                            <IconEye className="size-4 text-slate-400" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-rose-50" onClick={() => handleDelete(purchase.id)}>
                                            <IconTrash className="size-4 text-rose-400" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredPurchases.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                            <IconBuildingStore className="size-8 text-slate-200" />
                        </div>
                        <h3 className="font-black uppercase tracking-tighter">Belum ada pembelian</h3>
                        <p className="text-slate-400 text-sm font-medium">Klik "Tambah Pembelian" untuk mencatat stok masuk.</p>
                    </div>
                )}
            </div>

            {/* View Detail Dialog */}
            <Dialog open={!!selectedPurchase} onOpenChange={(open) => !open && setSelectedPurchase(null)}>
                <DialogContent className="max-w-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Nota: {selectedPurchase?.nonota}</DialogTitle>
                        <DialogDescription className="text-xs font-medium italic">Rincian barang yang dibeli dari {selectedPurchase?.distributor?.nama_distributor}.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Distributor</h4>
                                <p className="font-bold text-slate-900">{selectedPurchase?.distributor?.nama_distributor}</p>
                                <p className="text-xs text-slate-500 font-medium">{selectedPurchase?.distributor?.alamat}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tanggal Transaksi</h4>
                                <p className="font-bold text-slate-900">{selectedPurchase ? new Date(selectedPurchase.tgl_pembelian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ""}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-200 hover:bg-transparent">
                                        <TableHead className="text-[10px] font-black uppercase">Obat</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase">Qty</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-right">Harga</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedPurchase?.details?.map((detail: any) => (
                                        <TableRow key={detail.id} className="border-slate-200/50 hover:bg-transparent">
                                            <TableCell className="font-bold text-slate-900 text-sm">{detail.obat?.nama_obat}</TableCell>
                                            <TableCell className="font-bold text-slate-600 text-sm">{detail.jumlah_beli}</TableCell>
                                            <TableCell className="text-right text-xs font-medium">{formatCurrency(detail.harga_beli)}</TableCell>
                                            <TableCell className="text-right font-black text-slate-900">{formatCurrency(detail.subtotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Bayar</span>
                                <span className="text-xl font-black italic tracking-tighter">{formatCurrency(Number(selectedPurchase?.total_bayar))}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedPurchase(null)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
