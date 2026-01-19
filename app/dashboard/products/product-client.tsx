"use client"

import * as React from "react"
import {
    IconPlus,
    IconSearch,
    IconDotsVertical,
    IconEdit,
    IconPhotoPlus,
    IconTrash
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductDialog } from "./product-dialog"
import { deleteProduct, getProducts, getCategories } from "@/lib/actions/product-actions"

interface ProductClientProps {
    initialProducts: any[]
    categories: any[]
}

export function ProductClient({ initialProducts, categories }: ProductClientProps) {
    const [products, setProducts] = React.useState(initialProducts)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null)

    const filteredProducts = products.filter((p) =>
        p.nama_obat.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const refreshProducts = async () => {
        const data = await getProducts()
        setProducts(data)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            try {
                await deleteProduct(id)
                toast.success("Produk berhasil dihapus")
                refreshProducts()
            } catch (error) {
                toast.error("Gagal menghapus produk")
            }
        }
    }

    const openAddDialog = () => {
        setSelectedProduct(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (product: any) => {
        setSelectedProduct(product)
        setIsDialogOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative max-w-sm w-full">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari produk..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={openAddDialog}>
                    <IconPlus className="size-4 mr-2" />
                    Tambah Produk
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Image</TableHead>
                            <TableHead>Nama Obat</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead className="text-right">Harga</TableHead>
                            <TableHead className="text-right">Stok</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Tidak ada produk ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="relative size-10 rounded-md overflow-hidden bg-muted border group-hover:shadow-sm transition-shadow">
                                            {product.foto1 ? (
                                                <Image
                                                    src={product.foto1}
                                                    alt={product.nama_obat}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center size-full">
                                                    <IconPhotoPlus className="size-5 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{product.nama_obat}</span>
                                            {product.deskripsi_obat && (
                                                <span className="text-xs text-muted-foreground line-clamp-1">
                                                    {product.deskripsi_obat}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.jenis_obat?.jenis || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        Rp {new Intl.NumberFormat("id-ID").format(product.harga_jual)}
                                    </TableCell>
                                    <TableCell className="text-right">{product.stok}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <IconDotsVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                                    <IconEdit className="size-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <IconTrash className="size-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                product={selectedProduct}
                categories={categories}
                onSuccess={refreshProducts}
            />
        </div>
    )
}
