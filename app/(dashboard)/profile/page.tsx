"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Camera, Save, UserRound, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

const recentActivity = [
  { label: "Connexion à l'application", time: "Il y a 2 minutes" },
  { label: "Synchronisation des comptes bancaires", time: "Il y a 1 heure" },
  { label: "Export du rapport mensuel", time: "Il y a 3 heures" },
  { label: "Modification des paramètres de notification", time: "Hier" },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { first: parts[0], last: "" }
  return { first: parts[0], last: parts.slice(1).join(" ") }
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState("")
  const [bio, setBio] = useState("")
  const [language, setLanguage] = useState("fr")
  const [timezone, setTimezone] = useState("europe-paris")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (session?.user) {
      const { first, last } = splitName(session.user.name || "")
      setFirstName(first)
      setLastName(last)
      setEmail(session.user.email || "")
    }
  }, [session])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const newName = `${firstName} ${lastName}`.trim()
    await authClient.updateUser({
      name: newName,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  const user = session?.user
  const fullName = user?.name || "Utilisateur"
  const initials = getInitials(fullName)
  const createdAt = user?.createdAt
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : ""

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil</h1>

      <div className="space-y-6">
        {/* Informations personnelles */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Informations personnelles
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Gérez vos informations de profil et vos préférences
            </p>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                    {initials}
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {fullName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {createdAt && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Membre depuis le {createdAt}
                  </p>
                )}
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-gray-900 text-white text-xs font-medium rounded-full">
                  {user?.emailVerified ? "Email vérifié" : "Email non vérifié"}
                </span>
              </div>
            </div>

            {/* Formulaire */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Prénom
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Nom
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Téléphone
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Poste
                </label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Votre poste"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Biographie
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Décrivez-vous en quelques mots..."
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5">
              {saved && (
                <span className="text-sm text-emerald-600">Modifications enregistrées</span>
              )}
              <Button className="gap-2" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Préférences de compte */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Préférences de compte
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Configurez vos préférences d&apos;utilisation
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Langue
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Fuseau horaire
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="europe-paris">Europe/Paris (UTC+1)</option>
                  <option value="europe-london">Europe/London (UTC+0)</option>
                  <option value="america-new_york">America/New_York (UTC-5)</option>
                  <option value="asia-tokyo">Asia/Tokyo (UTC+9)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Activité récente
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Vos dernières actions sur la plateforme
            </p>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.label}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
                >
                  <UserRound className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.label}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
