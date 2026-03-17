"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type Theme = "light" | "dark" | "system"
type MoneyFormat = "space" | "nospace"
type SyncFrequency = "hourly" | "daily" | "manual"

export default function SettingsGeneralPage() {
  const [theme, setTheme] = useState<Theme>("light")
  const [moneyFormat, setMoneyFormat] = useState<MoneyFormat>("space")
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>("hourly")

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(true)
  const [notifLowBalance, setNotifLowBalance] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(true)

  const [analyticsSharing, setAnalyticsSharing] = useState(false)
  const [marketingComms, setMarketingComms] = useState(false)
  const [nonEssentialCookies, setNonEssentialCookies] = useState(false)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Paramètres généraux
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Préférences d'affichage */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Préférences d&apos;affichage
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Personnalisez l&apos;apparence de votre tableau de bord
            </p>

            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Thème de l&apos;application
              </p>
              <div className="flex gap-2">
                {([
                  { value: "light", label: "Clair" },
                  { value: "dark", label: "Sombre" },
                  { value: "system", label: "Système" },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                      theme === t.value
                        ? "border-gray-900 bg-white text-gray-900 font-medium"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Format des montants
              </p>
              <div className="flex gap-2">
                {([
                  { value: "space", label: "1 234,56 €" },
                  { value: "nospace", label: "1 234,56€" },
                ] as const).map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setMoneyFormat(f.value)}
                    className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                      moneyFormat === f.value
                        ? "border-gray-900 bg-white text-gray-900 font-medium"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Synchronisation des données */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Synchronisation des données
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Gérez la synchronisation de vos données bancaires
            </p>

            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-700">
                Synchronisation automatique
              </span>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Fréquence de synchronisation
              </p>
              <div className="space-y-2">
                {([
                  { value: "hourly", label: "Toutes les heures" },
                  { value: "daily", label: "Une fois par jour" },
                  { value: "manual", label: "Synchronisation manuelle uniquement" },
                ] as const).map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setSyncFrequency(freq.value)}
                    className={`block w-full text-left px-4 py-2.5 rounded-md border text-sm transition-colors ${
                      syncFrequency === freq.value
                        ? "border-gray-900 bg-white text-gray-900 font-medium"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Configurez vos préférences de notifications
            </p>

            <div className="space-y-4">
              {([
                { label: "Notifications par email", value: notifEmail, setter: setNotifEmail },
                { label: "Notifications push", value: notifPush, setter: setNotifPush },
                { label: "Alertes de solde bas", value: notifLowBalance, setter: setNotifLowBalance },
                { label: "Rapports hebdomadaires", value: notifWeekly, setter: setNotifWeekly },
              ] as const).map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardContent className="pt-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Confidentialité
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Gérez vos paramètres de confidentialité
            </p>

            <div className="space-y-4">
              {([
                { label: "Partage des données analytiques", value: analyticsSharing, setter: setAnalyticsSharing },
                { label: "Communications marketing", value: marketingComms, setter: setMarketingComms },
                { label: "Cookies non essentiels", value: nonEssentialCookies, setter: setNonEssentialCookies },
              ] as const).map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
