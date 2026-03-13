import { mockAccounts, mockTransactions } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { notFound } from "next/navigation"

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

function typeBadge(type: string) {
  if (type === "INCOME") return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Revenu</Badge>
  if (type === "EXPENSE") return <Badge className="bg-red-50 text-red-600 border-red-200 hover:bg-red-50">Dépense</Badge>
  return <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">Virement</Badge>
}

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const account = mockAccounts.find((a) => a.id === params.id)
  if (!account) notFound()

  const transactions = mockTransactions
    .filter((t) => t.accountId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{account.type === "BUSINESS" ? "🏢" : "👤"}</span>
            <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
            <Badge
              variant="outline"
              className={
                account.type === "BUSINESS"
                  ? "border-blue-300 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-500 bg-white"
              }
            >
              {account.type === "BUSINESS" ? "Entreprise" : "Personnel"}
            </Badge>
          </div>
          <p className="text-gray-500 text-sm">{transactions.length} transaction(s) enregistrée(s)</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Solde actuel</p>
          <p className="text-3xl font-bold text-gray-900">{fmt.format(account.balance)}</p>
          <p className="text-xs text-gray-400 mt-1">{account.currency}</p>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-500 font-medium">Date</TableHead>
              <TableHead className="text-gray-500 font-medium">Description</TableHead>
              <TableHead className="text-gray-500 font-medium">Type</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-gray-100 bg-white hover:bg-gray-50">
                <TableCell className="text-gray-500 text-sm">{tx.date}</TableCell>
                <TableCell className="text-gray-900 font-medium">{tx.description}</TableCell>
                <TableCell>{typeBadge(tx.type)}</TableCell>
                <TableCell className={`text-right font-semibold ${tx.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {tx.amount > 0 ? "+" : ""}{fmt.format(tx.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
