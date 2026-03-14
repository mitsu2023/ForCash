"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Crown, Shield, Eye, MoreHorizontal, AlertTriangle, Pencil, Info, Trash2, X, Mail, CalendarDays, Clock } from "lucide-react"

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
  updatedAt?: string
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

function MemberEditModal({ member, onClose, onSave }: {
  member: Member
  onClose: () => void
  onSave: (updated: Member) => void
}) {
  const [name, setName]   = useState(member.name)
  const [email, setEmail] = useState(member.email)
  const [role, setRole]   = useState(member.role)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toLocaleDateString("fr-FR")
    const initials = name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    onSave({ ...member, name: name.trim(), email: email.trim(), role, initials, updatedAt: now })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <p className="text-base font-semibold text-gray-900">Modifier le membre</p>
            <p className="text-sm text-gray-400 mt-0.5">Modifiez les informations de {member.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Rôle</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
              >
                <option value="Administrateur">Administrateur</option>
                <option value="Gestionnaire">Gestionnaire</option>
                <option value="Lecteur">Lecteur</option>
              </select>
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MemberDetailModal({ member, onClose }: { member: Member; onClose: () => void }) {
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
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-white">{member.initials}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{member.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={member.status} />
                {member.isLastAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3 h-3" />
                    Dernier admin
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Détails */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <RoleIcon role={member.role} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Rôle</p>
              <p className="text-sm font-medium text-gray-900">{member.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Date d'arrivée</p>
              <p className="text-sm font-medium text-gray-900">{member.joinedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Dernière activité</p>
              <p className="text-sm font-medium text-gray-900">{member.lastSeen}</p>
            </div>
          </div>

          {member.updatedAt && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Pencil className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Date de modification</p>
                <p className="text-sm font-medium text-gray-900">{member.updatedAt}</p>
              </div>
            </div>
          )}
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

function MemberMenu({ member, onSave }: { member: Member; onSave: (updated: Member) => void }) {
  const [open, setOpen] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit]     = useState(false)
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
          <div className="absolute right-0 z-10 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            <button
              onClick={() => { setOpen(false); setShowEdit(true) }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
              Modifier
            </button>
            <button
              onClick={() => { setOpen(false); setShowDetail(true) }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Info className="w-4 h-4 text-gray-400" />
              Détails
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <MemberEditModal member={member} onClose={() => setShowEdit(false)} onSave={onSave} />
      )}
      {showDetail && (
        <MemberDetailModal member={member} onClose={() => setShowDetail(false)} />
      )}
    </>
  )
}

export function TeamList({ members: initialMembers }: { members: Member[] }) {
  const [members, setMembers]           = useState(initialMembers)
  const [search, setSearch]             = useState("")
  const [roleFilter, setRoleFilter]     = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  function handleSave(updated: Member) {
    setMembers((prev) => prev.map((m) => m.id === updated.id ? updated : m))
  }

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
                  <MemberMenu member={member} onSave={handleSave} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
