import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Forcash — Gestionnaire financier",
  description: "Gérez vos comptes personnels et professionnels",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        <TopNav />
        <Sidebar />
        <main className="ml-56 mt-14 min-h-[calc(100vh-3.5rem)] p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
