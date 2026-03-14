"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Users,
  Settings,
  CircleUserRound,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/accounts", label: "Comptes", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
{ href: "/team", label: "Équipe", icon: Users },
  { href: "/settings", label: "Paramètres", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

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
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50">
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
            <CircleUserRound className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Mon compte</p>
            <p className="text-xs text-gray-400 truncate">connecté</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
