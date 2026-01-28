"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants/navigation"
import Dock, { DockDataItem } from "@/components/Dock"
import { IconCreditCard, IconHome, IconLogout, IconNotification, IconUserCircle } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function DashboardDock() {
    const { state } = useSidebar()
    const { data: session } = useSession()
    const router = useRouter()
    const userRole = (session?.user as any)?.jabatan

    // Filter items based on user role (same logic as sidebar)
    const filteredItems = DASHBOARD_NAV_ITEMS.filter((item) => {
        if (item.role && item.role !== userRole) {
            return false
        }
        return true
    })

    // Map to DockDataItem format
    const menuItems: DockDataItem[] = filteredItems.map((item) => ({
        icon: <item.icon className="size-full p-2" />,
        label: item.title,
        onClick: () => router.push(item.url),
    }))

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" })
    }

    const dockItems: DockDataItem[] = [
        {
            icon: <IconHome className="size-full  p-2" />,
            label: "Home",
            onClick: () => router.push("/"),
        },
        { type: 'separator' },
        ...menuItems,
        { type: 'separator' },
        {
            icon: <IconUserCircle className="size-full p-2" />,
            label: "Account",
            dropdownContent: (
                <>
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
                </>
            )
        }
    ]

    return (
        <AnimatePresence>
            {state === "collapsed" && (
                <motion.div
                    initial={{ y: 80, x: "-50%", opacity: 0 }}
                    animate={{ y: 0, x: "-50%", opacity: 1 }}
                    exit={{ y: 80, x: "-50%", opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 120 }}
                    className="fixed bottom-6 left-1/2 z-40 pointer-events-none"
                >
                    <div className="pointer-events-auto">
                        <Dock
                            items={dockItems}
                            panelHeight={72}
                            magnification={60}
                            distance={10}
                            baseItemSize={48}
                            spring={{ mass: 0.6, stiffness: 120, damping: 18 }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
