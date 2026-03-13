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
import { Users, Crown, Shield, Eye } from "lucide-react"

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Users className="w-4 h-4" />
        Inviter un membre
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg">Inviter un membre</DialogTitle>
            <p className="text-gray-500 text-sm">
              Renseignez les informations de la personne à inviter.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nom */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <Input
                placeholder="ex. Marie Dupont"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Adresse e-mail</label>
              <Input
                type="email"
                placeholder="ex. marie.dupont@entreprise.fr"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
              />
            </div>

            {/* Rôle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Rôle</label>
              <Select>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-gray-900 h-12">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900 min-w-[22rem]">
                  <SelectItem value="Administrateur" className="focus:bg-gray-100 focus:text-gray-900 py-3">
                    <div className="flex items-center gap-3">
                      <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="font-medium">Administrateur</p>
                        <p className="text-sm text-gray-400">Accès complet à toutes les fonctionnalités</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Gestionnaire" className="focus:bg-gray-100 focus:text-gray-900 py-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="font-medium">Gestionnaire</p>
                        <p className="text-sm text-gray-400">Gestion des comptes et transactions</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Lecteur" className="focus:bg-gray-100 focus:text-gray-900 py-3">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium">Lecteur</p>
                        <p className="text-sm text-gray-400">Consultation uniquement, aucune modification</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
              Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
