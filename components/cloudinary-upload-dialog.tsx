"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconCloudUpload, IconLoader2, IconPhoto, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"

interface CloudinaryUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (url: string) => void
    uploadPreset?: string
}

export function CloudinaryUploadDialog({
    open,
    onOpenChange,
    onSuccess,
    uploadPreset = "ml_default"
}: CloudinaryUploadDialogProps) {
    const [dragActive, setDragActive] = React.useState(false)
    const [file, setFile] = React.useState<File | null>(null)
    const [preview, setPreview] = React.useState<string | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Format file tidak didukung. Harap pilih gambar.")
            return
        }
        setFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const removeFile = () => {
        setFile(null)
        setPreview(null)
    }

    const uploadFile = async () => {
        if (!file) return

        setIsUploading(true)
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "djxplzruy"
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", uploadPreset)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Cloudinary error response:", errorData)
                throw new Error(errorData.error?.message || "Upload failed")
            }

            const data = await response.json()
            toast.success("Gambar berhasil diupload!")
            onSuccess(data.secure_url)
            onOpenChange(false)
            removeFile()
        } catch (error: any) {
            toast.error(`Gagal mengupload: ${error.message || "Terjadi kesalahan"}`)
            console.error("Upload error detail:", error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Gambar Produk</DialogTitle>
                    <DialogDescription>
                        Pilih atau seret gambar untuk diupload ke Cloudinary.
                    </DialogDescription>
                </DialogHeader>

                <div
                    className={cn(
                        "relative mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all",
                        dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/20 hover:border-muted-foreground/50",
                        preview ? "p-4" : "p-10"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {preview ? (
                        <div className="relative group w-full aspect-video">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="rounded-lg object-contain bg-muted/50"
                            />
                            {!isUploading && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={removeFile}
                                >
                                    <IconX className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <IconCloudUpload className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Tarik & lepaskan file atau klik untuk memilih</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (Maks. 5MB)</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-2"
                            >
                                Browse Files
                            </Button>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isUploading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={uploadFile}
                        disabled={!file || isUploading}
                        className="min-w-[120px]"
                    >
                        {isUploading ? (
                            <>
                                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Upload Gambar"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
