import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAuth = !!token
        const { pathname } = req.nextUrl

        const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

        if (isAuthPage) {
            if (isAuth) {
                // Redirect based on user type
                if (token.userType === "staff") {
                    return NextResponse.redirect(new URL("/dashboard", req.url))
                } else {
                    return NextResponse.redirect(new URL("/", req.url))
                }
            }
            return null
        }

        // Dashboard Protection
        if (pathname.startsWith("/dashboard")) {
            if (!isAuth) {
                const loginUrl = new URL("/login", req.url)
                loginUrl.searchParams.set("error", "unauthorized")
                return NextResponse.redirect(loginUrl)
            }

            // Block Customers from Dashboard
            if (token.userType === "customer") {
                return NextResponse.redirect(new URL("/", req.url))
            }
        }
    },
    {
        callbacks: {
            authorized: () => true,
        },
    }
)

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
}
