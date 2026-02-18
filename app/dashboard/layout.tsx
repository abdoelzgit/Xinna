import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { DashboardDock } from "@/components/dashboard/dashboard-dock"
import { UnauthorizedDialog } from "@/components/unauthorized-dialog"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <div className="hidden md:block">
                <AppSidebar variant="inset" />
            </div>
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    {children}
                </div>
            </SidebarInset>
            <React.Suspense fallback={null}>
                <UnauthorizedDialog />
            </React.Suspense>
            <DashboardDock />
        </SidebarProvider >
    )
}
