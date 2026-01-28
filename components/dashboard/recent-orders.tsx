import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface RecentOrdersProps {
    orders: any[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val)

    return (
        <div className="px-4 lg:px-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Transaksi Terbaru</h3>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-none">
                            <TableHead className="text-[10px] font-black uppercase px-6">Order ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Pelanggan</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Tanggal</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Total</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-right px-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="group hover:bg-slate-50/50 border-slate-50 transition-colors">
                                <TableCell className="px-6 font-bold italic text-slate-900">#{order.id}</TableCell>
                                <TableCell className="font-semibold text-slate-700">{order.pelanggan?.nama_pelanggan}</TableCell>
                                <TableCell className="text-xs text-slate-500 font-medium">
                                    {new Date(order.tgl_penjualan).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="font-bold text-emerald-600">{formatCurrency(order.total_bayar)}</TableCell>
                                <TableCell className="text-right px-6">
                                    <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-black px-2 py-0.5">
                                        {order.status_order.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {orders.length === 0 && (
                    <div className="py-12 text-center text-slate-400 italic text-sm">
                        Belum ada transaksi terbaru.
                    </div>
                )}
            </div>
        </div>
    )
}
