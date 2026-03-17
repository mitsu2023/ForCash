import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const publicPaths = ["/login", "/register", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  const sessionCookie = getSessionCookie(request)

  // Session invalidée côté serveur → supprimer le cookie et afficher /login
  if (pathname === "/login" && searchParams.get("expired") === "1") {
    const url = new URL("/login", request.url)
    const response = NextResponse.redirect(url)
    response.cookies.delete("better-auth.session_token")
    return response
  }

  // Utilisateur connecté sur les pages auth → rediriger vers dashboard
  if (sessionCookie && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Route publique → laisser passer
  if (isPublic) {
    return NextResponse.next()
  }

  // Pas de cookie → rediriger ou 401
  if (!sessionCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
