"use client"

import { useState } from "react"
import { Search, ArrowUpDown, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, MoreHorizontal, Calendar } from "lucide-react"
import { mockAccounts } from "@/lib/mock-data"

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

type Transaction = {
  id: string
  accountId: string
  description: string
  amount: number
  type: string
  date: string
  category: string
  status: string
}

function TransactionIcon({ type }: { type: string }) {
  if (type === "INCOME") {
    return (
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
      </div>
    )
  }
  if (type === "EXPENSE") {
    return (
      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <ArrowUpRight className="w-4 h-4 text-red-500" />
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <ArrowLeftRight className="w-4 h-4 text-gray-500" />
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const isHighlight = category === "Ventes"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isHighlight
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-700 border border-gray-200"
    }`}>
      {category}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      {status}
    </span>
  )
}

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [accountFilter, setAccountFilter] = useState("all")

  const filtered = transactions.filter((tx) => {
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || tx.type === typeFilter
    const matchAccount = accountFilter === "all" || tx.accountId === accountFilter
    return matchSearch && matchType && matchAccount
  })

  return (
    <>
      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900">Filtres et recherche</h2>
        <p className="text-sm text-gray-400 mt-0.5 mb-4">Filtrez et recherchez dans vos transactions</p>

        <div className="flex gap-3">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
            />
          </div>

          {/* Filtre type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
          >
            <option value="all">Toutes les...</option>
            <option value="INCOME">Entrées</option>
            <option value="EXPENSE">Sorties</option>
            <option value="TRANSFER">Virements</option>
          </select>

          {/* Filtre compte */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
          >
            <option value="all">Tous les comptes</option>
            {mockAccounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {/* Filtre statut */}
          <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer">
            <option>Tous les statuts</option>
            <option>Validée</option>
          </select>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Liste des transactions</h2>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} transaction(s) trouvée(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none cursor-pointer">
              <option>Date</option>
              <option>Montant</option>
              <option>Description</option>
            </select>
            <button className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">Aucune transaction trouvée.</p>
          ) : (
            filtered.map((tx) => {
              const account = mockAccounts.find((a) => a.id === tx.accountId)
              const isPositive = tx.amount > 0
              const amountColor = tx.type === "TRANSFER"
                ? "text-gray-600"
                : isPositive
                ? "text-emerald-600"
                : "text-red-500"

              return (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <TransactionIcon type={tx.type} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{tx.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span>{account?.name ?? "—"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <CategoryBadge category={tx.category} />
                    <StatusBadge status={tx.status} />
                    <p className={`text-sm font-semibold w-28 text-right ${amountColor}`}>
                      {isPositive ? "+" : ""}{fmt.format(tx.amount)}
                    </p>
                    <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
