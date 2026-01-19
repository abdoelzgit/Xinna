"use client"

import * as React from "react"
import Image from "next/image"
import { Pill as PillIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: (string | null | undefined)[]
    alt: string
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
    const validImages = images.filter((img): img is string => !!img)
    const [activeIndex, setActiveIndex] = React.useState(0)

    if (validImages.length === 0) {
        return (
            <div className="aspect-3/4 bg-slate-50 border border-slate-100 rounded-[3rem] overflow-hidden relative flex items-center justify-center shadow-sm">
                <div className="flex flex-col items-center justify-center space-y-4 opacity-10">
                    <PillIcon className="size-48 text-slate-950" />
                    <span className="text-xl font-black uppercase tracking-widest">No Image</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="aspect-3/4 bg-slate-50 border border-slate-100 rounded-[3rem] overflow-hidden relative flex items-center justify-center shadow-sm">
                <Image
                    src={validImages[activeIndex]}
                    alt={`${alt} - view ${activeIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-700"
                    priority
                />
            </div>

            {validImages.length > 1 && (
                <div className="flex justify-center gap-4">
                    {validImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative size-20 rounded-2xl overflow-hidden border-2 transition-all",
                                activeIndex === index
                                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                                    : "border-slate-100 opacity-50 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${alt} thumb ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
