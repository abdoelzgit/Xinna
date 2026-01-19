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
                return NextResponse.redirect(new URL("/dashboard", req.url))
            }
            return null
        }

        if (!isAuth && pathname.startsWith("/dashboard")) {
            const loginUrl = new URL("/login", req.url)
            loginUrl.searchParams.set("error", "unauthorized")
            return NextResponse.redirect(loginUrl)
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
