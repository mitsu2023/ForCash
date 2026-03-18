"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Eye, EyeOff, Trash2, Wifi, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Account = {
  id: string
  name: string
  type: string
  balance: number
  currency: string
  bank: string
  accountNumberLast4: string | null
}

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

const bankColors: Record<string, string> = {
  "Crédit Agricole": "text-green-600",
  "BNP Paribas":     "text-blue-600",
  "Société Générale": "text-red-500",
}

function maskedNumber(last4: string | null) {
  if (!last4) return "•••• •••• •••• ••••"
  return `•••• •••• •••• ${last4}`
}

function formatAccountNumber(value: string) {
  return value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()
}

function AccountCard({
  account,
  revealedNumber,
  onToggleReveal,
  loading,
}: {
  account: Account
  revealedNumber?: string | null
  onToggleReveal?: () => void
  loading?: boolean
}) {
  return (
    <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 flex flex-col justify-between shadow-2xl">
      {/* Fond décoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

      {/* Ligne du haut : chip + contactless + type */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Puce */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center">
            <div className="w-6 h-4 border border-amber-600/40 rounded-sm" />
          </div>
          {/* Contactless */}
          <Wifi className="w-5 h-5 text-white/60 rotate-90" />
        </div>
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
          {account.type === "BUSINESS" ? "Business" : "Personal"}
        </span>
      </div>

      {/* Numéro de carte + bouton œil */}
      <div className="relative flex items-center gap-3">
        <p className="text-xl font-mono tracking-[0.2em] text-white">
          {revealedNumber ? formatAccountNumber(revealedNumber) : maskedNumber(account.accountNumberLast4)}
        </p>
        {onToggleReveal && (
          <button
            onClick={onToggleReveal}
            disabled={loading}
            className="text-white/50 hover:text-white transition-colors disabled:opacity-30"
          >
            {revealedNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Ligne du bas : infos */}
      <div className="relative flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Titulaire du compte</p>
          <p className="text-sm font-semibold text-white">{account.name}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Banque</p>
          <p className="text-sm font-semibold text-white">{account.bank}</p>
        </div>
      </div>
    </div>
  )
}

export function AccountOverviewList({ accounts, totalBalance }: { accounts: Account[]; totalBalance: number }) {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [revealedNumber, setRevealedNumber] = useState<string | null>(null)
  const [loadingNumber, setLoadingNumber] = useState(false)

  async function handleDelete(id: string) {
    const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" })
    if (res.ok) router.refresh()
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        {accounts.map((account) => {
          const pct = totalBalance > 0 ? (account.balance / totalBalance) * 100 : 0
          const colorClass = bankColors[account.bank] ?? "text-gray-500"
          return (
            <div key={account.id} className="py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{account.name}</p>
                  <p className={`text-xs font-medium mt-0.5 ${colorClass}`}>{account.bank}</p>
                  {account.accountNumberLast4 && (
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      •••• •••• •••• {account.accountNumberLast4}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{fmt.format(account.balance)}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-900 min-w-[10rem]">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setSelectedAccount(account)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleDelete(account.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* Barre de progression */}
              <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gray-900 rounded-full"
                  style={{ width: `${pct.toFixed(1)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{pct.toFixed(1)}% du total</p>
            </div>
          )
        })}
      </div>

      {/* Dialog détails du compte */}
      <Dialog open={!!selectedAccount} onOpenChange={(open) => { if (!open) { setSelectedAccount(null); setRevealedNumber(null) } }}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-lg p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg font-semibold text-gray-900">Détails du compte</DialogTitle>
          </DialogHeader>

          {selectedAccount && (
            <div className="px-6 pb-6 space-y-5">
              {/* Carte bancaire */}
              <AccountCard
                account={selectedAccount}
                revealedNumber={revealedNumber}
                loading={loadingNumber}
                onToggleReveal={async () => {
                  if (revealedNumber) {
                    setRevealedNumber(null)
                    return
                  }
                  setLoadingNumber(true)
                  try {
                    const res = await fetch(`/api/accounts/${selectedAccount.id}`)
                    if (res.ok) {
                      const data = await res.json()
                      setRevealedNumber(data.accountNumber ?? null)
                    }
                  } finally {
                    setLoadingNumber(false)
                  }
                }}
              />

              {/* Infos complémentaires */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Solde actuel</p>
                  <p className="text-lg font-bold text-gray-900">{fmt.format(selectedAccount.balance)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Devise</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAccount.currency}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedAccount.type === "BUSINESS" ? "Entreprise" : "Personnel"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Banque</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAccount.bank}</p>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
