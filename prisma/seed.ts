import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean existing data
  await prisma.transaction.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.financialAccount.deleteMany()

  // Seed financial accounts
  const comptePrincipal = await prisma.financialAccount.create({
    data: { name: "Compte Principal", type: "PERSONAL", balance: 4250.75, currency: "EUR", bank: "Crédit Agricole" },
  })
  const epargne = await prisma.financialAccount.create({
    data: { name: "Épargne", type: "PERSONAL", balance: 12800.0, currency: "EUR", bank: "BNP Paribas" },
  })
  const forcash = await prisma.financialAccount.create({
    data: { name: "Forcash SARL", type: "BUSINESS", balance: 38500.5, currency: "EUR", bank: "Société Générale" },
  })

  // Seed transactions
  await prisma.transaction.createMany({
    data: [
      { financialAccountId: comptePrincipal.id, description: "Salaire mars", amount: 2800, type: "INCOME", date: new Date("2025-03-01"), category: "Salaires", status: "Validée" },
      { financialAccountId: comptePrincipal.id, description: "Loyer", amount: 950, type: "EXPENSE", date: new Date("2025-03-02"), category: "Autre", status: "Validée" },
      { financialAccountId: comptePrincipal.id, description: "Courses Carrefour", amount: 87.4, type: "EXPENSE", date: new Date("2025-03-05"), category: "Autre", status: "Validée" },
      { financialAccountId: forcash.id, description: "Facture client A", amount: 5400, type: "INCOME", date: new Date("2025-03-06"), category: "Ventes", status: "Validée" },
      { financialAccountId: epargne.id, description: "Virement épargne", amount: 500, type: "TRANSFER", date: new Date("2025-03-07"), category: "Virements", status: "Validée" },
      { financialAccountId: forcash.id, description: "Abonnement Notion", amount: 16, type: "EXPENSE", date: new Date("2025-03-08"), category: "Abonnements", status: "Validée" },
      { financialAccountId: comptePrincipal.id, description: "Remboursement ami", amount: 60, type: "INCOME", date: new Date("2025-03-10"), category: "Autre", status: "Validée" },
      { financialAccountId: forcash.id, description: "Facture client B", amount: 3200, type: "INCOME", date: new Date("2025-03-12"), category: "Ventes", status: "Validée" },
      { financialAccountId: comptePrincipal.id, description: "Achat Genshin Impact", amount: 80, type: "EXPENSE", date: new Date("2025-03-14"), category: "Loisir", status: "Validée" },
      { financialAccountId: forcash.id, description: "Abonnement Claude", amount: 200, type: "EXPENSE", date: new Date("2025-03-14"), category: "Abonnements", status: "Validée" },
    ],
  })

  // Seed team members
  await prisma.teamMember.createMany({
    data: [
      { name: "Miarintsoa Ravelonjatovo", initials: "MR", email: "miar.ravel@forcash.fr", role: "Administrateur", status: "Actif", joinedAt: new Date("2024-01-10"), lastSeen: "Il y a 5 minutes", isLastAdmin: true },
      { name: "Mitsu Miryu", initials: "MM", email: "miryu.mitsu@forcash.fr", role: "Lecteur", status: "Actif", joinedAt: new Date("2024-03-22"), lastSeen: "Il y a 2 heures", isLastAdmin: false },
      { name: "Natty Ariantsoa", initials: "NA", email: "aria.natsu@forcash.fr", role: "Gestionnaire", status: "Actif", joinedAt: new Date("2024-06-15"), lastSeen: "Il y a 1 jour", isLastAdmin: false },
      { name: "Nikky Natolotra", initials: "NN", email: "nikky.nat@forcash.fr", role: "Gestionnaire", status: "En attente", joinedAt: new Date("2025-02-01"), lastSeen: "Jamais connecté", isLastAdmin: false },
    ],
  })

  console.log("Seed terminé avec succès !")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
