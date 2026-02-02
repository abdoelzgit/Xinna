import { FlickeringGrid } from "@/components/ui/flickering-grid"



export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white">
            <FlickeringGrid
                className="absolute inset-0 z-0"
                squareSize={4}
                gridGap={6}
                color="#94a3b8"
                maxOpacity={0.3}
                flickerChance={0.1}
            />
            {/* Overlay Gradient: Menggunakan bg-gradient-to-b dan warna transparan agar grid tetap terlihat */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/100 via-white/100 to-white/0 pointer-events-none"></div>
            <div className="relative z-10 min-h-screen py-4">
                {children}
            </div>
        </div>
    )
}
