import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopNav />
      <Sidebar />
      <main className="ml-56 mt-14 min-h-[calc(100vh-3.5rem)] p-8">
        {children}
      </main>
    </>
  )
}
