"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart2, CircleUserRound, Settings, User, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"

const profileMenuItems = [
  { label: "Profil", icon: User, href: "/profile" },
  { label: "Paramètres", icon: Settings, href: "/settings" },
]

export function TopNav({ showProfile = false }: { showProfile?: boolean }) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-50">
      <Link href="/" className="flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-gray-900" />
        <span className="font-bold text-gray-900 tracking-tight text-sm uppercase">
          Forcash
        </span>
      </Link>

      <div className="flex-1" />

      {showProfile && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <CircleUserRound className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {session?.user?.name || "Mon compte"}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              {profileMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={async () => {
                  setMenuOpen(false)
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/login")
                        router.refresh()
                      },
                    },
                  })
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
