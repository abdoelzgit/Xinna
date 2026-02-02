import { FlickeringGrid } from "@/components/ui/flickering-grid"

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This layout overrides the root layout for /login route
    // No Header, No Footer - just the children
    return <div className="relative min-h-screen overflow-hidden bg-white">
        <FlickeringGrid
            className="absolute inset-0 z-0"
            gridGap={6}
            color="#94a3b8"
            maxOpacity={0.3}
            flickerChance={0.1}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/100 via-white/100 to-white/0 pointer-events-none"></div>


        <div className="relative z-10 min-h-screen py-4">

            {children}
        </div>
    </div>
}
