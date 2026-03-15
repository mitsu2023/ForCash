import { prisma } from "@/lib/prisma"
import { TransactionsList } from "@/components/transactions-list"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export default async function TransactionsPage() {
  const accounts = await prisma.financialAccount.findMany()
  const rawTransactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  })

  // Serialize dates to strings for the client component
  const transactions = rawTransactions.map((t) => ({
    id: t.id,
    accountId: t.financialAccountId,
    description: t.description,
    amount: t.amount,
    type: t.type,
    date: new Intl.DateTimeFormat("fr-FR").format(t.date),
    category: t.category,
    status: t.status,
  }))

  const accountsList = accounts.map((a) => ({ id: a.id, name: a.name }))

  const totalEntrees = rawTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSorties = rawTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  const soldeNet = totalEntrees + totalSorties

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <NewTransactionDialog />
      </div>

      {/* 4 cartes résumé */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-gray-500">Total des entrées</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">+{fmt.format(totalEntrees)}</p>
          <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-3">
            <span className="text-sm text-gray-500">Total des sorties</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{fmt.format(totalSorties)}</p>
          <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-3">
            <span className="text-sm text-gray-500">Solde net</span>
          </div>
          <p className={`text-2xl font-bold ${soldeNet >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {soldeNet >= 0 ? "+" : ""}{fmt.format(soldeNet)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-3">
            <span className="text-sm text-gray-500">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
          <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
        </div>
      </div>

      {/* Filtres + liste (client component) */}
      <TransactionsList transactions={transactions} accounts={accountsList} />
    </div>
  )
}
