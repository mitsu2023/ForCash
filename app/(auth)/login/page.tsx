"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        router.push("/")
        router.refresh()
      },
      onError: (ctx) => {
        setError(ctx.error.message || "Email ou mot de passe incorrect.")
        setLoading(false)
      },
    })
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ForCash</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestionnaire financier
        </p>
      </div>

      <Card>
        <CardContent className="pt-2">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Connexion
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Connectez-vous à votre compte
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="nom@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                />
                Se souvenir de moi
              </label>
              <Link
                href="#"
                className="text-sm text-gray-900 font-medium hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Se connecter
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-gray-900 font-medium hover:underline"
            >
              S&apos;inscrire
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
