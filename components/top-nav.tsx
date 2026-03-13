"use client"

import { BarChart2 } from "lucide-react"

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-50">
      <div className="flex-1 flex items-center justify-center gap-2">
        <BarChart2 className="w-5 h-5 text-gray-900" />
        <span className="font-bold text-gray-900 tracking-tight text-sm uppercase">Forcash</span>
      </div>
    </header>
  )
}
