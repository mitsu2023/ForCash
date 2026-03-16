export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { TeamList } from "@/components/team-list"
import { InviteMemberDialog } from "@/components/invite-member-dialog"
import { Crown, Shield, Mail, Users } from "lucide-react"

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany()

  const total      = members.length
  const actifs     = members.filter((m) => m.status === "Actif").length
  const admins     = members.filter((m) => m.role === "Administrateur").length
  const managers   = members.filter((m) => m.role === "Gestionnaire").length
  const enAttente  = members.filter((m) => m.status === "En attente").length

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Équipe</h1>
        <InviteMemberDialog />
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Total membres</span>
            <Users className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-400 mt-1">{actifs} actifs</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Administrateurs</span>
            <Crown className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{admins}</p>
          <p className="text-xs text-gray-400 mt-1">Accès complet</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Gestionnaires</span>
            <Shield className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{managers}</p>
          <p className="text-xs text-gray-400 mt-1">Gestion des comptes</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">En attente</span>
            <Mail className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{enAttente}</p>
          <p className="text-xs text-gray-400 mt-1">Invitations envoyées</p>
        </div>
      </div>

      {/* Filtres + liste */}
      <TeamList members={members.map((m) => ({
        ...m,
        joinedAt: m.joinedAt.toISOString().slice(0, 10),
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      }))} />
    </div>
  )
}
