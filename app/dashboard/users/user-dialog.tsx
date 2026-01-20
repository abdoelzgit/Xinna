"use client"

import * as React from "react"
import { toast } from "sonner"
import { Jabatan } from "@prisma/client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { createUser, updateUser } from "@/lib/actions/user-actions"

interface UserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: any
    onSuccess: () => void
}

export function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
    const { data: session } = useSession()
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
        jabatan: "karyawan" as Jabatan,
    })

    const isSelf = user?.id === (session?.user as any)?.id

    React.useEffect(() => {
        // ... existing useEffect logic ...
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "", // Jangan tampilkan password lama
                jabatan: (user.jabatan as Jabatan) || "karyawan",
            })
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                jabatan: "karyawan",
            })
        }
    }, [user, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (user) {
                await updateUser(user.id, formData)
                toast.success("User berhasil diperbarui")
            } else {
                if (!formData.password) {
                    toast.error("Password wajib diisi untuk user baru")
                    setLoading(false)
                    return
                }
                await createUser(formData)
                toast.success("User berhasil ditambahkan")
            }
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{user ? "Edit User" : "Tambah User"}</DialogTitle>
                        <DialogDescription>
                            {user
                                ? "Perbarui informasi user di bawah ini."
                                : "Isi formulir di bawah ini untuk menambahkan user baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email user"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                Password {user && <span className="text-xs font-normal text-muted-foreground">(Kosongkan jika tidak ingin mengubah)</span>}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={user ? "********" : "Masukkan password"}
                                required={!user}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="jabatan">Jabatan</Label>
                            <Select
                                value={formData.jabatan}
                                onValueChange={(value) => setFormData({ ...formData, jabatan: value as Jabatan })}
                                disabled={isSelf}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jabatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Jabatan).map((role) => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isSelf && (
                                <p className="text-[10px] text-muted-foreground italic">
                                    * Anda tidak dapat mengubah jabatan akun sendiri demi keamanan.
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
