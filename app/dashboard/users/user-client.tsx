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

interface UserClientProps {
    initialUsers: any[]
}

export function UserClient({ initialUsers }: UserClientProps) {
    const [users, setUsers] = React.useState(initialUsers)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<any>(null)

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="relative max-w-sm w-full">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari user..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={openAddDialog}>
                    <IconPlus className="size-4 mr-2" />
                    Tambah User
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
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
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center justify-center size-8 rounded-full bg-muted border">
                                            <IconUser className="size-4 text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
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
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                    <IconEdit className="size-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(user.id)}
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

            <UserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
                onSuccess={refreshUsers}
            />
        </div>
    )
}
