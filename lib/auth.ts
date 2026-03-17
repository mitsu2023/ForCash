import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  session: {
    expiresIn: 60 * 60,       // 1 heure (en secondes)
    updateAge: 5 * 60,         // rafraîchir le token toutes les 5 min d'activité
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
})
