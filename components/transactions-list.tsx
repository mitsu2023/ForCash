"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ArrowUpDown, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, MoreHorizontal, Calendar, Eye, StickyNote, AlertTriangle, X } from "lucide-react"
import { resolvedAmount } from "@/lib/utils"

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

const CATEGORY_COLORS: Record<string, string> = {
  Vente: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Achat: "bg-red-50 text-red-700 border border-red-200",
  Abonnement: "bg-blue-50 text-blue-700 border border-blue-200",
  "Impôts": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Autres: "bg-white text-gray-700 border border-gray-200",
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Autres
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
      {category}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isFailed = status === "Échouée"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isFailed
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
    }`}>
      {status}
    </span>
  )
}

const TYPE_LABELS: Record<string, string> = {
  INCOME: "Entrée",
  EXPENSE: "Sortie",
  TRANSFER: "Virement",
}

type AccountInfo = { id: string; name: string }

function TransactionDetailModal({ tx, onClose, accounts }: { tx: Transaction; onClose: () => void; accounts: AccountInfo[] }) {
  const account = accounts.find((a) => a.id === tx.accountId)
  const amount = resolvedAmount(tx.amount, tx.type)
  const isPositive = amount > 0
  const amountColor = tx.type === "TRANSFER" ? "text-gray-700" : isPositive ? "text-emerald-600" : "text-red-500"

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <TransactionIcon type={tx.type} />
            <div>
              <p className="text-base font-semibold text-gray-900">{tx.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{TYPE_LABELS[tx.type] ?? tx.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Montant */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Montant</p>
          <p className={`text-3xl font-bold ${amountColor}`}>
            {isPositive ? "+" : ""}{fmt.format(amount)}
          </p>
        </div>

        {/* Détails */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Date</p>
            <p className="text-sm font-medium text-gray-900">{tx.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Compte</p>
            <p className="text-sm font-medium text-gray-900">{account?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Catégorie</p>
            <p className="text-sm font-medium text-gray-900">{tx.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Statut</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {tx.status}
            </span>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400 mb-1">Référence</p>
            <p className="text-sm font-mono text-gray-500">{tx.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

function TransactionMenu({ tx, accounts }: { tx: Transaction; accounts: AccountInfo[] }) {
  const [open, setOpen] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            <button
              onClick={() => { setOpen(false); setShowDetail(true) }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-400" />
              Voir les détails
            </button>
            <button
              onClick={() => { setOpen(false) }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <StickyNote className="w-4 h-4 text-gray-400" />
              Ajouter une note
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={() => { setOpen(false) }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Signaler une erreur
            </button>
          </div>
        )}
      </div>

      {showDetail && (
        <TransactionDetailModal tx={tx} accounts={accounts} onClose={() => setShowDetail(false)} />
      )}
    </>
  )
}

export function TransactionsList({ transactions, accounts }: { transactions: Transaction[]; accounts: AccountInfo[] }) {
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
            {accounts.map((a) => (
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
              const account = accounts.find((a) => a.id === tx.accountId)
              const displayAmt = resolvedAmount(tx.amount, tx.type)
              const isPositive = displayAmt > 0
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
                      {isPositive ? "+" : ""}{fmt.format(displayAmt)}
                    </p>
                    <TransactionMenu tx={tx} accounts={accounts} />
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
