"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function NewTransactionDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gray-900 hover:bg-gray-700 text-white"
      >
        + Nouvelle transaction
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">Nouvelle transaction</DialogTitle>
            <p className="text-gray-500 text-sm">Renseignez les détails du virement.</p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Numéro de compte destinataire */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Numéro de compte destinataire
              </label>
              <Input
                placeholder="ex. FR76 3000 6000 0112 3456 7890 189"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900 font-mono"
              />
            </div>

            {/* Montant */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Montant
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  EUR
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Input
                placeholder="ex. Facture client, Loyer..."
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer">
                <option value="">Sélectionner une catégorie</option>
                <option value="Ventes">Ventes</option>
                <option value="Salaires">Salaires</option>
                <option value="Loyer">Achat</option>
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
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              Annuler
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-700 text-white">
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
