"use client"

import { useState } from "react"
import { Search, Crown, Shield, Eye, MoreHorizontal, AlertTriangle } from "lucide-react"

type Member = {
  id: string
  name: string
  initials: string
  email: string
  role: string
  status: string
  joinedAt: string
  lastSeen: string
  isLastAdmin: boolean
}

function RoleIcon({ role }: { role: string }) {
  if (role === "Administrateur") return <Crown className="w-4 h-4 text-amber-500" />
  if (role === "Gestionnaire")   return <Shield className="w-4 h-4 text-blue-500" />
  return <Eye className="w-4 h-4 text-gray-400" />
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Actif") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        Actif
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      En attente
    </span>
  )
}

export function TeamList({ members }: { members: Member[] }) {
  const [search, setSearch]       = useState("")
  const [roleFilter, setRoleFilter]     = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === "all"   || m.role === roleFilter
    const matchStatus = statusFilter === "all" || m.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  return (
    <>
      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900">Filtres</h2>
        <p className="text-sm text-gray-400 mt-0.5 mb-4">Recherchez et filtrez les membres de votre équipe</p>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
          >
            <option value="all">Tous les rôles</option>
            <option value="Administrateur">Administrateur</option>
            <option value="Gestionnaire">Gestionnaire</option>
            <option value="Lecteur">Lecteur</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="En attente">En attente</option>
          </select>
        </div>
      </div>

      {/* Liste membres */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Membres de l'équipe</h2>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} membre(s) trouvé(s)</p>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">Aucun membre trouvé.</p>
          ) : (
            filtered.map((member) => (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-gray-700">{member.initials}</span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <StatusBadge status={member.status} />
                    {member.isLastAdmin && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        Dernier admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{member.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Rejoint le {member.joinedAt}
                    <span className="mx-1.5">•</span>
                    {member.lastSeen}
                  </p>
                </div>

                {/* Rôle + menu */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <RoleIcon role={member.role} />
                    <span>{member.role}</span>
                  </div>
                  <button className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
