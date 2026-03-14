export const mockAccounts = [
  { id: "1", name: "Compte Principal", type: "PERSONAL", balance: 4250.75, currency: "EUR", bank: "Crédit Agricole" },
  { id: "2", name: "Épargne", type: "PERSONAL", balance: 12800.00, currency: "EUR", bank: "BNP Paribas" },
  { id: "3", name: "Forcash SARL", type: "BUSINESS", balance: 38500.50, currency: "EUR", bank: "Société Générale" },
]

export const mockTeam = [
  { id: "1", name: "Miarintsoa Ravelonjatovo",  initials: "MR", email: "miar.ravel@forcash.fr",   role: "Administrateur", status: "Actif",      joinedAt: "2024-01-10", lastSeen: "Il y a 5 minutes", isLastAdmin: true  },
  { id: "2", name: "Mitsu Miryu",  initials: "MM", email: "miryu.mitsu@forcash.fr",   role: "Lecteur",   status: "Actif",      joinedAt: "2024-03-22", lastSeen: "Il y a 2 heures",  isLastAdmin: false },
  { id: "3", name: "Natty Ariantsoa",   initials: "NA", email: "aria.natsu@forcash.fr",    role: "Gestionnaire",        status: "Actif",      joinedAt: "2024-06-15", lastSeen: "Il y a 1 jour",    isLastAdmin: false },
  { id: "4", name: "Nikky Natolotra",    initials: "NN", email: "nikky.nat@forcash.fr",     role: "Gestionnaire",   status: "En attente", joinedAt: "2025-02-01", lastSeen: "Jamais connecté",  isLastAdmin: false },
]

export const mockTransactions = [
  { id: "1", accountId: "1", description: "Salaire mars", amount: 2800, type: "INCOME", date: "2025-03-01", category: "Salaires", status: "Validée" },
  { id: "2", accountId: "1", description: "Loyer", amount: 950, type: "EXPENSE", date: "2025-03-02", category: "Autre", status: "Validée" },
  { id: "3", accountId: "1", description: "Courses Carrefour", amount: 87.40, type: "EXPENSE", date: "2025-03-05", category: "Autre", status: "Validée" },
  { id: "4", accountId: "3", description: "Facture client A", amount: 5400, type: "INCOME", date: "2025-03-06", category: "Ventes", status: "Validée" },
  { id: "5", accountId: "2", description: "Virement épargne", amount: 500, type: "TRANSFER", date: "2025-03-07", category: "Virements", status: "Validée" },
  { id: "6", accountId: "3", description: "Abonnement Notion", amount: 16, type: "EXPENSE", date: "2025-03-08", category: "Abonnements", status: "Validée" },
  { id: "7", accountId: "1", description: "Remboursement ami", amount: 60, type: "INCOME", date: "2025-03-10", category: "Autre", status: "Validée" },
  { id: "8", accountId: "3", description: "Facture client B", amount: 3200, type: "INCOME", date: "2025-03-12", category: "Ventes", status: "Validée" },
  { id: "9", accountId: "1", description: "Achat Genshin Impact", amount: 80, type: "EXPENSE", date: "2025-03-14", category: "Loisir", status: "Validée" },
  { id: "10", accountId: "3", description: "Abonnement Claude", amount: 200, type: "EXPENSE", date: "2025-03-14", category: "Abonnements", status: "Validée" },
]

