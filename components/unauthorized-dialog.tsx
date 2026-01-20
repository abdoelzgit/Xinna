"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconAlertTriangle } from "@tabler/icons-react"

export function UnauthorizedDialog() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const error = searchParams.get("error")
        if (error === "unauthorized") {
            setOpen(true)
        }
    }, [searchParams])

    const handleClose = () => {
        setOpen(false)
        // Clean up the URL
        const params = new URLSearchParams(searchParams.toString())
        params.delete("error")
        const query = params.toString() ? `?${params.toString()}` : ""
        router.replace(`${pathname}${query}`)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <IconAlertTriangle className="size-6" />
                        <DialogTitle>Akses Ditolak</DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-slate-600">
                        Maaf, Anda tidak memiliki izin (otoritas) untuk mengakses halaman ini. Halaman tersebut hanya dapat diakses oleh Admin.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button onClick={handleClose} className="w-full sm:w-auto">
                        Mengerti
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
