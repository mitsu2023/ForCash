export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { NewAccountDialog } from "@/components/new-account-dialog"
import { AccountOverviewList } from "@/components/account-overview-list"
import { Copy, Minus, CalendarClock, EyeOff } from "lucide-react"

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export default async function AccountsPage() {
  const accounts = await prisma.financialAccount.findMany()
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Comptes bancaires</h1>
        <NewAccountDialog />
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Solde total</span>
            <Copy className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{fmt.format(totalBalance)}</p>
          <p className="text-xs text-gray-400 mt-1">Tous comptes confondus</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Comptes actifs</span>
            <Minus className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
          <p className="text-xs text-gray-400 mt-1">Sur 1 établissement bancaire</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Dernière synchronisation</span>
            <CalendarClock className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Il y a 5min</p>
          <p className="text-xs text-gray-400 mt-1">Synchronisation automatique activée</p>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Vue d&apos;ensemble des comptes</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Gérez vos comptes bancaires et suivez leurs soldes en temps réel
          </p>
        </div>

        <div className="px-6 py-4">
          {/* Ligne total + masquer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total : {fmt.format(totalBalance)}</span>
            <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
              <EyeOff className="w-4 h-4" />
              Masquer
            </button>
          </div>

          {/* Lignes comptes */}
          <AccountOverviewList
            accounts={accounts.map((a) => ({
              id: a.id,
              name: a.name,
              type: a.type,
              balance: a.balance,
              currency: a.currency,
              bank: a.bank,
              accountNumberLast4: a.accountNumberLast4,
            }))}
            totalBalance={totalBalance}
          />

        </div>
      </div>
    </div>
  )
}
