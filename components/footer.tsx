import React from "react"

export function Footer() {
    return (
        <footer className="w-full border-t py-6 mt-auto">
            <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-8 mx-auto">
                <p className="text-sm font-sans tracking-wide">
                    © {new Date().getFullYear()} Xinna Apotek. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
