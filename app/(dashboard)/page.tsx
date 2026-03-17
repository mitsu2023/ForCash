export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
import { resolvedAmount } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export default async function DashboardPage() {
  const userId = (await getUserId())!
  const accounts = await prisma.financialAccount.findMany({ where: { userId } })
  const transactions = await prisma.transaction.findMany({
    where: { financialAccount: { userId } },
    orderBy: { date: "desc" },
    take: 5,
    include: { financialAccount: true },
  })

  const allTransactions = await prisma.transaction.findMany({
    where: { financialAccount: { userId } },
  })
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const totalIncome = allTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = allTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble de vos finances</p>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Solde total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{fmt.format(totalBalance)}</p>
            <p className="text-xs text-gray-400 mt-1">Tous comptes confondus</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Comptes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            <p className="text-xs text-gray-400 mt-1">Comptes actifs</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{fmt.format(totalIncome)}</p>
            <p className="text-xs text-gray-400 mt-1">Total encaissé</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dépenses du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{fmt.format(totalExpense)}</p>
            <p className="text-xs text-gray-400 mt-1">Total dépensé</p>
          </CardContent>
        </Card>
      </div>

      {/* Colonnes comptes + transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Liste des comptes */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-900">Mes comptes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {accounts.map((account) => (
              <Link key={account.id} href="/accounts">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      {account.type === "BUSINESS" ? "🏢" : "👤"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{account.name}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-0.5${
                          account.type === "BUSINESS"
                            ? "border-blue-300 text-blue-600 bg-blue-50"
                            : "border-gray-300 text-gray-500 bg-white"
                        }`}
                      >
                        {account.type === "BUSINESS" ? "Entreprise" : "Personnel"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{fmt.format(account.balance)}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Dernières transactions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-900">Dernières transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {transactions.map((tx) => {
              const displayAmt = resolvedAmount(tx.amount, tx.type)
              const isPositive = displayAmt > 0
              const dateStr = new Intl.DateTimeFormat("fr-FR").format(tx.date)
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.financialAccount.name} · {dateStr}</p>
                  </div>
                  <p className={`text-sm font-semibold ${tx.type === "TRANSFER" ? "text-gray-600" : isPositive ? "text-emerald-600" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{fmt.format(displayAmt)}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
