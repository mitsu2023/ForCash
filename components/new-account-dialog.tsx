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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NewAccountDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gray-900 hover:bg-gray-700 text-white"
      >
        + Ajouter un compte
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">Nouveau compte</DialogTitle>
            <p className="text-gray-500 text-sm">Renseignez les informations du compte à créer.</p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nom du compte */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Nom du compte
              </label>
              <Input
                placeholder="ex. Compte courant BNP"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
              />
            </div>

            {/* Numéro de compte */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Numéro de compte
              </label>
              <Input
                placeholder="ex. FR76 3000 6000 0112 3456 7890 189"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900 font-mono"
              />
              <p className="text-xs text-gray-400">Format IBAN ou numéro interne</p>
            </div>

            {/* Type de compte */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Type de compte
              </label>
              <Select>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-gray-900 h-12 text-base">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900 w-full min-w-[22rem]">
                  <SelectItem value="PERSONAL" className="focus:bg-gray-100 focus:text-gray-900 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="font-medium">Personnel</p>
                        <p className="text-sm text-gray-400">Compte bancaire individuel</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="BUSINESS" className="focus:bg-gray-100 focus:text-gray-900 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🏢</span>
                      <div>
                        <p className="font-medium">Entreprise</p>
                        <p className="text-sm text-gray-400">Compte professionnel / société</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Solde initial + Devise */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Solde initial
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Devise
                </label>
                <Select defaultValue="EUR">
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="EUR" className="focus:bg-gray-100 focus:text-gray-900">EUR — €</SelectItem>
                    <SelectItem value="USD" className="focus:bg-gray-100 focus:text-gray-900">USD — $</SelectItem>
                    <SelectItem value="GBP" className="focus:bg-gray-100 focus:text-gray-900">GBP — £</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              Créer le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
