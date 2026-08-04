import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin routes: require admin role
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login?error=unauthorized", req.url))
      }
    }

    // Authenticated-only routes
    if (
      pathname.startsWith("/my-submissions") ||
      pathname.startsWith("/rewards")
    ) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // These paths require authentication
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/my-submissions") ||
          pathname.startsWith("/rewards")
        ) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/my-submissions/:path*", "/rewards/:path*"],
}
