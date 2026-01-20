"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/lib/actions/product-actions"
import { ImageUpload } from "@/components/ui/image-upload"
import { Textarea } from "@/components/ui/textarea"


interface ProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: any
    categories: any[]
    onSuccess: () => void
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    categories,
    onSuccess,
}: ProductDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [formData, setFormData] = React.useState({
        nama_obat: "",
        id_jenis_obat: "",
        harga_jual: 0,
        stok: 0,
        deskripsi_obat: "",
        foto1: "",
        foto2: "",
        foto3: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    // Reset or populate form when product/open changes
    React.useEffect(() => {
        if (open) {
            if (product) {
                setFormData({
                    nama_obat: product.nama_obat || "",
                    id_jenis_obat: product.id_jenis_obat?.toString() || "",
                    harga_jual: product.harga_jual || 0,
                    stok: product.stok || 0,
                    deskripsi_obat: product.deskripsi_obat || "",
                    foto1: product.foto1 || "",
                    foto2: product.foto2 || "",
                    foto3: product.foto3 || "",
                })
            } else {
                setFormData({
                    nama_obat: "",
                    id_jenis_obat: "",
                    harga_jual: 0,
                    stok: 0,
                    deskripsi_obat: "",
                    foto1: "",
                    foto2: "",
                    foto3: "",
                })
            }
            setErrors({})
        }
    }, [product, open])

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.nama_obat) newErrors.nama_obat = "Nama obat wajib diisi"
        if (!formData.id_jenis_obat) newErrors.id_jenis_obat = "Jenis obat wajib diisi"
        if (formData.harga_jual < 0) newErrors.harga_jual = "Harga tidak boleh negatif"
        if (formData.stok < 0) newErrors.stok = "Stok tidak boleh negatif"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            if (product) {
                await updateProduct(product.id.toString(), formData)
                toast.success("Produk berhasil diperbarui")
            } else {
                await createProduct(formData)
                toast.success("Produk berhasil ditambahkan")
            }
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan produk")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[720px] p-0 overflow-hidden flex flex-col">
                <div className="p-6 border-b">
                    <SheetHeader>
                        <SheetTitle>{product ? "Edit Produk" : "Tambah Produk Baru"}</SheetTitle>
                        <SheetDescription>
                            Isi data produk di bawah ini. Anda dapat mengunggah hingga 3 foto produk.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                    <FieldGroup className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field>
                                <FieldLabel>Nama Obat</FieldLabel>
                                <Input
                                    value={formData.nama_obat}
                                    onChange={(e) => setFormData({ ...formData, nama_obat: e.target.value })}
                                    placeholder="Ex: Paracetamol 500mg"
                                />
                                {errors.nama_obat && (
                                    <p className="text-destructive text-xs">{errors.nama_obat}</p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Jenis Obat</FieldLabel>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, id_jenis_obat: value })}
                                    value={formData.id_jenis_obat}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Jenis Obat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.jenis}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.id_jenis_obat && (
                                    <p className="text-destructive text-xs">{errors.id_jenis_obat}</p>
                                )}
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field>
                                <FieldLabel>Harga Jual (Rp)</FieldLabel>
                                <Input
                                    type="number"
                                    value={formData.harga_jual}
                                    onChange={(e) => setFormData({ ...formData, harga_jual: Number(e.target.value) })}
                                    placeholder="0"
                                />
                                {errors.harga_jual && (
                                    <p className="text-destructive text-xs">{errors.harga_jual}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel>Stok Unit</FieldLabel>
                                <Input
                                    type="number"
                                    value={formData.stok}
                                    onChange={(e) => setFormData({ ...formData, stok: Number(e.target.value) })}
                                    placeholder="0"
                                />
                                {errors.stok && (
                                    <p className="text-destructive text-xs">{errors.stok}</p>
                                )}
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Deskripsi Obat</FieldLabel>
                            <Textarea
                                value={formData.deskripsi_obat}
                                onChange={(e) => setFormData({ ...formData, deskripsi_obat: e.target.value })}
                                placeholder="Keterangan dosis, efek samping, dll..."
                            />
                        </Field>

                        <div className="space-y-4 pt-4 border-t">
                            <FieldLabel className="text-sm font-black uppercase tracking-[0.1em] text-slate-500">Foto Produk (Maks. 3)</FieldLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Field className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utama</span>
                                    <ImageUpload
                                        value={formData.foto1}
                                        onChange={(url) => setFormData({ ...formData, foto1: url })}
                                        onRemove={() => setFormData({ ...formData, foto1: "" })}
                                    />
                                </Field>
                                <Field className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Samping</span>
                                    <ImageUpload
                                        value={formData.foto2}
                                        onChange={(url) => setFormData({ ...formData, foto2: url })}
                                        onRemove={() => setFormData({ ...formData, foto2: "" })}
                                    />
                                </Field>
                                <Field className="space-y-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail</span>
                                    <ImageUpload
                                        value={formData.foto3}
                                        onChange={(url) => setFormData({ ...formData, foto3: url })}
                                        onRemove={() => setFormData({ ...formData, foto3: "" })}
                                    />
                                </Field>
                            </div>
                        </div>
                    </FieldGroup>
                </form>

                <div className="p-6 border-t bg-slate-50/50 flex justify-end gap-3 sticky bottom-0">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl font-bold uppercase tracking-widest text-xs"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? "Menyimpan..." : product ? "Simpan Perubahan" : "Konfirmasi & Simpan"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
