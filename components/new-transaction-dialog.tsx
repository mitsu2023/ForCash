"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Account {
  id: string
  name: string
  last4: string | null
}

interface NewTransactionDialogProps {
  accounts: Account[]
}

export function NewTransactionDialog({ accounts }: NewTransactionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [sourceAccountId, setSourceAccountId] = useState("")
  const [destinationType, setDestinationType] = useState<"internal" | "external">("internal")
  const [destinationAccountId, setDestinationAccountId] = useState("")
  const [externalIban, setExternalIban] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  function resetForm() {
    setSourceAccountId("")
    setDestinationType("internal")
    setDestinationAccountId("")
    setExternalIban("")
    setAmount("")
    setDescription("")
    setCategory("")
    setError("")
  }

  async function handleSubmit() {
    setError("")

    if (!sourceAccountId) { setError("Sélectionnez un compte source."); return }
    if (destinationType === "internal" && !destinationAccountId) { setError("Sélectionnez un compte destinataire."); return }
    if (destinationType === "external" && !externalIban.trim()) { setError("Saisissez un IBAN destinataire."); return }
    if (!amount || parseFloat(amount) <= 0) { setError("Saisissez un montant valide."); return }
    if (!description.trim()) { setError("Saisissez une description."); return }
    if (!category) { setError("Sélectionnez une catégorie."); return }

    setLoading(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceAccountId,
          destinationAccountId: destinationType === "internal" ? destinationAccountId : null,
          externalIban: destinationType === "external" ? externalIban : null,
          amount: parseFloat(amount),
          description: description.trim(),
          category,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Une erreur est survenue.")
        return
      }

      resetForm()
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gray-900 hover:bg-gray-700 text-white"
      >
        + Nouvelle transaction
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">Nouvelle transaction</DialogTitle>
            <p className="text-gray-500 text-sm">Renseignez les détails du virement.</p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            {/* 1. Compte source */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Compte source
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
              >
                <option value="">Sélectionner un compte</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}{account.last4 ? ` (••••${account.last4})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Compte destinataire */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Compte destinataire
              </label>
              <select
                value={destinationType === "internal" ? destinationAccountId : "__external__"}
                onChange={(e) => {
                  if (e.target.value === "__external__") {
                    setDestinationType("external")
                    setDestinationAccountId("")
                  } else {
                    setDestinationType("internal")
                    setDestinationAccountId(e.target.value)
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
              >
                <option value="">Sélectionner un compte</option>
                {accounts
                  .filter((a) => a.id !== sourceAccountId)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}{account.last4 ? ` (••••${account.last4})` : ""}
                    </option>
                  ))}
                <option value="__external__">Autre (saisir un IBAN)</option>
              </select>
              {destinationType === "external" && (
                <Input
                  value={externalIban}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\s/g, "")
                    const formatted = raw.replace(/(.{4})/g, "$1 ").trim()
                    setExternalIban(formatted)
                  }}
                  placeholder="ex. FR76 3000 6000 0112 3456 7890 189"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900 font-mono mt-2"
                />
              )}
            </div>

            {/* 3. Montant */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Montant
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  EUR
                </span>
              </div>
            </div>

            {/* 4. Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Input
                placeholder="ex. Facture client, Loyer..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
              />
            </div>

            {/* 5. Catégorie */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Ventes">Ventes</option>
                <option value="Salaires">Salaires</option>
                <option value="Achat">Achat</option>
                <option value="Abonnements">Abonnements</option>
                <option value="Fournitures">Fournitures</option>
                <option value="Impôts">Impôts</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => { setOpen(false); resetForm() }}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-700 text-white"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
