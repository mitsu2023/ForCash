import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

/**
 * Get the authenticated user's ID from the current request.
 * Returns null if no valid session.
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

/**
 * Get the authenticated user's ID or redirect to login.
 */
export async function requireUserId(): Promise<string> {
  const userId = await getUserId()
  if (!userId) redirect("/login?expired=1")
  return userId
}
