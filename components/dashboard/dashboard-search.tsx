"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconDashboard,
    IconPills,
    IconReport,
    IconListDetails,
    IconTruckDelivery,
    IconUsers,
    IconSearch,
} from "@tabler/icons-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function DashboardSearch() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                className="relative flex h-9 w-full max-w-[200px] items-center gap-2 border-b border-slate-200 bg-transparent px-1 transition-all hover:border-primary/50 focus:outline-none group"
                onClick={() => setOpen(true)}
            >
                <IconSearch className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors text-xs font-medium">Cari fitur...</span>
                <kbd className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-bold text-slate-400 opacity-100 xl:flex">
                    <span className="text-[8px]">CTRL</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Ketik nama fitur atau menu..." />
                <CommandList className="scrollbar-none">
                    <CommandEmpty>Fitur tidak ditemukan.</CommandEmpty>
                    <CommandGroup heading="Rekomendasi Menu">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard"))}
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                        >
                            <IconDashboard className="size-4 text-slate-400" />
                            <span className="font-medium">Dashboard Overview</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/products"))}
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                        >
                            <IconPills className="size-4 text-slate-400" />
                            <span className="font-medium">Manajemen Obat</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/sales"))}
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                        >
                            <IconReport className="size-4 text-slate-400" />
                            <span className="font-medium">Laporan Penjualan</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/shippings"))}
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                        >
                            <IconTruckDelivery className="size-4 text-slate-400" />
                            <span className="font-medium">Pelacakan Pengiriman</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Lainnya">
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/purchases"))}
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                        >
                            <IconListDetails className="size-4 text-slate-400" />
                            <span className="font-medium">Data Pembelian Stok</span>
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push("/dashboard/users"))}
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer"
                        >
                            <IconUsers className="size-4 text-slate-400" />
                            <span className="font-medium">Kelola Pengguna</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
