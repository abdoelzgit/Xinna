"use client"

import * as React from "react"
import { IconPhotoPlus, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CloudinaryUploadDialog } from "@/components/cloudinary-upload-dialog"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border group shadow-sm">
                        <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                onClick={onRemove}
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7 rounded-full shadow-lg"
                            >
                                <IconX className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            alt="Uploaded product image"
                            src={value}
                        />
                    </div>
                ) : (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-40 h-40 border-dashed border-2 flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors rounded-lg bg-muted/20"
                            onClick={() => setOpen(true)}
                        >
                            <div className="p-3 rounded-full bg-background border shadow-sm">
                                <IconPhotoPlus className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-semibold">Upload Gambar</span>
                                <span className="text-[10px] text-muted-foreground italic text-center px-2">PNG, JPG up to 5MB</span>
                            </div>
                        </Button>
                        <CloudinaryUploadDialog
                            open={open}
                            onOpenChange={setOpen}
                            onSuccess={onChange}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
