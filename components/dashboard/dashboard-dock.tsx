"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants/navigation"
import { Dock, DockIcon } from "@/components/ui/dock"
import { IconCreditCard, IconHome, IconLogout, IconNotification, IconUserCircle } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function DashboardDock() {
    const { state } = useSidebar()
    const { data: session } = useSession()
    const router = useRouter()
    const userRole = (session?.user as any)?.jabatan

    const filteredItems = DASHBOARD_NAV_ITEMS.filter((item) => {
        if (item.role && item.role !== userRole) {
            return false
        }
        return true
    })

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" })
    }

    return (
        <AnimatePresence>
            {(state === "collapsed" || (typeof window !== "undefined" && window.innerWidth < 768)) && (
                <motion.div
                    initial={{ y: 80, x: "-50%", opacity: 0 }}
                    animate={{ y: 0, x: "-50%", opacity: 1 }}
                    exit={{ y: 80, x: "-50%", opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 120 }}
                    className="fixed bottom-6 left-1/2 z-40"
                >
                    <TooltipProvider>
                        <Dock className="bg-white/80 backdrop-blur-md border-slate-200 shadow-2xl">
                            {/* Home Item */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DockIcon onClick={() => router.push("/")} className="bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <IconHome className="size-5 text-slate-600" />
                                    </DockIcon>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white border-0">
                                    Home
                                </TooltipContent>
                            </Tooltip>

                            <div className="w-px h-6 bg-slate-200 mx-1" />

                            {/* Nav Items */}
                            {filteredItems.map((item, index) => (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <DockIcon onClick={() => router.push(item.url)} className="bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <item.icon className="size-5 text-slate-600" />
                                        </DockIcon>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white border-0">
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            <div className="w-px h-6 bg-slate-200 mx-1" />

                            {/* Account Dropdown */}
                            <DropdownMenu>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <DockIcon className="bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20">
                                                <IconUserCircle className="size-5 text-primary" />
                                            </DockIcon>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-[10px] font-bold uppercase tracking-widest bg-slate-900 text-white border-0">
                                        Account
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent
                                    side="top"
                                    align="center"
                                    sideOffset={20}
                                    className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100"
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarFallback className="rounded-lg text-slate-600">
                                                    {session?.user?.name?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{session?.user?.name}</span>
                                                <span className="text-muted-foreground truncate text-xs">
                                                    {session?.user?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                                            <IconUserCircle className="size-4 mr-2" />
                                            Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <IconCreditCard className="size-4 mr-2" />
                                            Billing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <IconNotification className="size-4 mr-2" />
                                            Notifications
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                        <IconLogout className="size-4 mr-2" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Dock>
                    </TooltipProvider>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
