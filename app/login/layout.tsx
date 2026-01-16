export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This layout overrides the root layout for /login route
    // No Header, No Footer - just the children
    return <>{children}</>
}
