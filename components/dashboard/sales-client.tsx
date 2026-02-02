"use client"

import * as React from "react"
import {
    IconEye,
    IconCheck,
    IconClock,
    IconTruck,
    IconX,
    IconSearch,
    IconFilter,
    IconDotsVertical,
    IconChevronRight
} from "@tabler/icons-react"
import { toast } from "sonner"
import { StatusOrder } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { updateOrderStatus } from "@/lib/actions/sales-actions"

interface SalesClientProps {
    sales: any[]
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    [StatusOrder.Menunggu_Konfirmasi]: {
        label: "Menunggu Konfirmasi",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: IconClock
    },
    [StatusOrder.Diproses]: {
        label: "Diproses",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: IconTruck
    },
    [StatusOrder.Menunggu_Kurir]: {
        label: "Menunggu Kurir",
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: IconTruck
    },
    [StatusOrder.Selesai]: {
        label: "Selesai",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: IconCheck
    },
    [StatusOrder.Dibatalkan_Pembeli]: {
        label: "Dibatalkan Pembeli",
        color: "bg-rose-100 text-rose-700 border-rose-200",
        icon: IconX
    },
    [StatusOrder.Dibatalkan_Penjual]: {
        label: "Dibatalkan Penjual",
        color: "bg-rose-100 text-rose-700 border-rose-200",
        icon: IconX
    },
    [StatusOrder.Bermasalah]: {
        label: "Bermasalah",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: IconX
    }
}

export function SalesClient({ sales: initialSales }: SalesClientProps) {
    const [sales, setSales] = React.useState(initialSales)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
    const [isUpdating, setIsUpdating] = React.useState(false)

    // Filter sales based on search term (customer name or order ID)
    const filteredSales = sales.filter(item =>
        item.pelanggan?.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm)
    )

    const handleStatusUpdate = async (id: string, newStatus: StatusOrder) => {
        setIsUpdating(true)
        try {
            const result = await updateOrderStatus(id, newStatus)
            if (result.success) {
                toast.success("Status pesanan diperbarui")
                // Update local state
                setSales(prev => prev.map(s => s.id === id ? { ...s, status_order: newStatus } : s))
            } else {
                toast.error(result.error || "Gagal memperbarui status")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsUpdating(false)
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
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Penjualan</h2>
                    <p className="text-muted-foreground text-sm font-medium">Pantau dan kelola semua transaksi pesanan masuk.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        placeholder="Cari pelanggan atau ID pesanan..."
                        className="pl-10 rounded-xl bg-slate-50 border-none h-11 focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <Table >
                    <TableHeader className=" bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest py-5">ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Pelanggan</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Tanggal</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Total</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Status</TableHead>
                            <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-widest py-5 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSales.map((sale) => {
                            const config = statusConfig[sale.status_order] || statusConfig[StatusOrder.Menunggu_Konfirmasi]
                            const Icon = config?.icon || IconClock

                            return (
                                <TableRow key={sale.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                    <TableCell className="font-bold text-slate-400 text-xs">#{sale.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{sale.pelanggan?.nama_pelanggan}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{sale.pelanggan?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-slate-600">
                                        {new Date(sale.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell className="font-black text-emerald-600">{formatCurrency(Number(sale.total_bayar))}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`rounded-xl px-3 py-1 border-none shadow-sm flex items-center gap-1.5 w-fit ${config.color}`}>
                                            <Icon className="size-3" />
                                            {config.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm">
                                                    <IconDotsVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl p-2 w-[200px]">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5">Kelola Pesanan</DropdownMenuLabel>
                                                <DropdownMenuItem className="rounded-xl gap-2 font-bold focus:bg-slate-50 cursor-pointer" onClick={() => setSelectedOrder(sale)}>
                                                    <IconEye className="size-4 text-slate-400" /> Lihat Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5">Ubah Status</DropdownMenuLabel>

                                                {Object.entries(statusConfig).map(([status, cfg]) => {
                                                    if (status === sale.status_order) return null
                                                    const StatusIcon = cfg.icon
                                                    return (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            className="rounded-xl gap-2 font-bold focus:bg-slate-50 cursor-pointer text-xs"
                                                            onClick={() => handleStatusUpdate(sale.id, status as StatusOrder)}
                                                        >
                                                            <StatusIcon className="size-3.5 text-slate-400" /> {cfg.label}
                                                        </DropdownMenuItem>
                                                    )
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                {filteredSales.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                            <IconSearch className="size-8 text-slate-200" />
                        </div>
                        <h3 className="font-black uppercase tracking-tighter">Tidak ada pesanan</h3>
                        <p className="text-slate-400 text-sm font-medium">Sesuaikan pencarian Anda atau periksa kembali nanti.</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Detail Pesanan #{selectedOrder?.id}</DialogTitle>
                        <DialogDescription className="text-xs font-medium">Informasi lengkap transaksi pelanggan.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Informasi Pelanggan</h4>
                                    <p className="font-bold text-slate-900">{selectedOrder?.pelanggan?.nama_pelanggan}</p>
                                    <p className="text-xs text-slate-500 font-medium">{selectedOrder?.pelanggan?.email}</p>
                                    <p className="text-xs text-slate-500 font-medium">{selectedOrder?.pelanggan?.no_telp}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Alamat Pengiriman</h4>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                        {selectedOrder?.pelanggan?.alamat1}<br />
                                        {selectedOrder?.pelanggan?.kota1}, {selectedOrder?.pelanggan?.propinsi1}<br />
                                        {selectedOrder?.pelanggan?.kodepos1}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Metode & Pengiriman</h4>
                                    <div className="flex gap-2 mb-2">
                                        <Badge variant="secondary" className="rounded-lg text-[10px] font-bold">{selectedOrder?.metode_bayar?.nama_metode}</Badge>
                                        <Badge variant="secondary" className="rounded-lg text-[10px] font-bold">{selectedOrder?.jenis_pengiriman?.nama_jenis}</Badge>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Saat Ini</h4>
                                    {selectedOrder && (
                                        <Badge variant="outline" className={`rounded-xl px-3 py-1 border-none shadow-sm flex items-center gap-1.5 w-fit ${statusConfig[selectedOrder.status_order]?.color || 'bg-slate-100'}`}>
                                            {React.createElement(statusConfig[selectedOrder.status_order]?.icon || IconTruck, { className: "size-3" })}
                                            {statusConfig[selectedOrder.status_order]?.label || selectedOrder.status_order}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Item Pesanan</h4>
                            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                <Table>
                                    <TableBody>
                                        {selectedOrder?.details?.map((detail: any) => (
                                            <TableRow key={detail.id} className="hover:bg-transparent border-slate-200/50">
                                                <TableCell className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 font-black text-xs text-primary shadow-sm">
                                                            {detail.obat?.nama_obat.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 text-sm">{detail.obat?.nama_obat}</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">Qty: {detail.jumlah_beli} x {formatCurrency(Number(detail.harga_beli))}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-black text-slate-900 text-sm py-3">
                                                    {formatCurrency(Number(detail.jumlah_beli) * Number(detail.harga_beli))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Pembayaran</span>
                                    <span className="text-xl font-black italic tracking-tighter">{formatCurrency(Number(selectedOrder?.total_bayar))}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
