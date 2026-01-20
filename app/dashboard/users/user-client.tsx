"use client"

import * as React from "react"
import {
    IconPlus,
    IconSearch,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconUser
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { UserDialog } from "./user-dialog"
import { deleteUser, getUsers } from "@/lib/actions/user-actions"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

interface UserClientProps {
    initialUsers: any[]
    initialCustomers: any[]
}

export function UserClient({ initialUsers, initialCustomers }: UserClientProps) {
    const [users, setUsers] = React.useState(initialUsers)
    const [customers, setCustomers] = React.useState(initialCustomers)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<any>(null)

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredCustomers = customers.filter((c) =>
        c.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const refreshUsers = async () => {
        const data = await getUsers()
        setUsers(data)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            try {
                await deleteUser(id)
                toast.success("User berhasil dihapus")
                refreshUsers()
            } catch (error) {
                toast.error("Gagal menghapus user")
            }
        }
    }

    const openAddDialog = () => {
        setSelectedUser(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (user: any) => {
        setSelectedUser(user)
        setIsDialogOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 p-4 lg:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola staf apotek dan pantau pelanggan yang terdaftar.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative max-w-sm w-full">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari user atau pelanggan..."
                            className="pl-9 bg-card"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="staff" className="w-full">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="staff">Semua Staf</TabsTrigger>
                        <TabsTrigger value="customers">Pelanggan Terdaftar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="staff" className="mt-0">
                        <Button onClick={openAddDialog}>
                            <IconPlus className="size-4 mr-2" />
                            Tambah User
                        </Button>
                    </TabsContent>
                </div>

                <TabsContent value="staff" className="mt-0">
                    <div className="rounded-lg border bg-card overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Jabatan</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Tidak ada user ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center justify-center size-8 rounded-full bg-muted border mx-auto">
                                                    <IconUser className="size-4 text-muted-foreground" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize font-medium">
                                                    {user.jabatan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <IconDotsVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                            <IconEdit className="size-4 mr-2" />
                                                            Edit Info
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            onClick={() => handleDelete(user.hashedId)}
                                                        >
                                                            <IconTrash className="size-4 mr-2" />
                                                            Hapus Akun
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
                </TabsContent>

                <TabsContent value="customers" className="mt-0">
                    <div className="rounded-lg border bg-card overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead>Nama Pelanggan</TableHead>
                                    <TableHead>Kontak & Alamat</TableHead>
                                    <TableHead>Tanggal Register</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Belum ada pelanggan terdaftar.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 border border-primary/20 mx-auto">
                                                    <IconUser className="size-4 text-primary" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{customer.nama_pelanggan}</span>
                                                    <span className="text-xs text-muted-foreground">{customer.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-medium">{customer.no_telp || "-"}</span>
                                                    <span className="text-[10px] text-muted-foreground line-clamp-1">{customer.alamat1 || "Alamat belum diatur"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(customer.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            <UserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
                onSuccess={refreshUsers}
            />
        </div>
    )
}
