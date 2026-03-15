"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Users,
  Settings,
  CircleUserRound,
  User,
  LogOut,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/accounts", label: "Comptes", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/team", label: "Équipe", icon: Users },
]

const profileMenuItems = [
  { label: "Paramètres", icon: Settings, href: "/settings" },
  { label: "Profil", icon: User, href: "/profile" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [profileMenuOpen])

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-3 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        <div className="space-y-0.5">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Compte connecté */}
      <div className="relative px-3 py-4 border-t border-gray-200" ref={menuRef}>
        {/* Menu déroulant */}
        {profileMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
            {profileMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setProfileMenuOpen(false)}
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
                setProfileMenuOpen(false)
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

        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
            <CircleUserRound className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name || "Mon compte"}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email || "connecté"}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </button>
      </div>
    </aside>
  )
}
