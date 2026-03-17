import { TopNav } from "@/components/top-nav"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopNav showProfile />
      <main className="mt-14 min-h-[calc(100vh-3.5rem)] p-8 max-w-4xl mx-auto">
        {children}
      </main>
    </>
  )
}
