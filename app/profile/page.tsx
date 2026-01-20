"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { IconUser, IconMail, IconPhone, IconMapPin, IconCalendar } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
    const { data: session } = useSession()
    const user = session?.user as any

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Memuat data profil...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header / Cover */}
                <div className="relative h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-blue-500/10 rounded-3xl overflow-hidden border border-primary/10">
                    <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                        <Avatar className="size-32 border-4 border-white shadow-xl rounded-2xl">
                            <AvatarFallback className="text-4xl bg-white text-primary font-bold">
                                {user.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-4">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                            <Badge variant="secondary" className="capitalize mt-1">
                                {user.userType === 'customer' ? 'Pelanggan Terdaftar' : user.jabatan}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                    {/* Sidebar Info */}
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Hubungi Kami</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <IconMail className="size-4 text-primary" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <IconPhone className="size-4 text-primary" />
                                <span>{user.no_telp || "Belum ada nomor"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Detail Akun</CardTitle>
                                <CardDescription>Informasi pribadi Anda di Xinna Apotek.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <IconMapPin className="size-5 text-primary mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold gray-900">Alamat Pengiriman</p>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            {user.alamat1 || "Anda belum mengatur alamat pengiriman utama."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <IconCalendar className="size-5 text-primary mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold gray-900">Member Sejak</p>
                                        <p className="text-sm text-slate-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Desember 2023"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
