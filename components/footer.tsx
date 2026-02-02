import React from "react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full bg-white pt-32 pb-12 mt-auto overflow-hidden">
            <div className="container px-4 md:px-8 mx-auto">
                {/* Massive Branding Typography */}
                <div className="mb-24">
                    <h2 className="text-[12vw] font-black tracking-tighter leading-none text-black select-none opacity-[0.03] absolute left-0 right-0 text-center pointer-events-none uppercase">
                        Xinna Pharmacy
                    </h2>
                    <h2 className="text-[12vw] font-black tracking-tighter leading-none text-slate-900 select-none text-center uppercase">
                        Xinna Pharmacy
                    </h2>
                </div>

                {/* Bottom row with brand and links */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-100 pt-10">
                    <div className="flex items-center gap-2">
                      <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="https://res.cloudinary.com/djxplzruy/image/upload/v1769671252/qsiqelb26rr3t9tjsrkl.png"
                            alt="Xinna Logo"
                            width={240}
                            height={40}
                            className="h-4 w-auto object-contain"
                        />
                    </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <Link href="/about" className="hover:text-primary transition-colors">About Xinna</Link>
                        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
