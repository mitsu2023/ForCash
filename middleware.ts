import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const publicPaths = ["/login", "/register", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  const sessionCookie = getSessionCookie(request)

  // Utilisateur connecté sur les pages auth → rediriger vers dashboard
  if (sessionCookie && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Route publique → laisser passer
  if (isPublic) {
    return NextResponse.next()
  }

  // Route API protégée sans session → 401
  if (pathname.startsWith("/api/") && !sessionCookie) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Page protégée sans session → rediriger vers login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
