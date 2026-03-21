import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
import { decrypt } from "@/lib/crypto"

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { searchParams } = request.nextUrl
  const accountId = searchParams.get("accountId")

  const transactions = await prisma.transaction.findMany({
    where: {
      financialAccount: { userId },
      ...(accountId ? { financialAccountId: accountId } : {}),
    },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(transactions)
}

export async function POST(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const body = await request.json()
  const { sourceAccountId, destinationAccountId, externalIban, amount, description, category } = body

  if (!sourceAccountId || !amount || !description || !category) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
  }

  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: "Montant invalide" }, { status: 400 })
  }

  // Vérifier que le compte source appartient à l'utilisateur
  const sourceAccount = await prisma.financialAccount.findFirst({
    where: { id: sourceAccountId, userId },
  })
  if (!sourceAccount) {
    return NextResponse.json({ error: "Compte source introuvable" }, { status: 404 })
  }

  if (sourceAccount.balance < parsedAmount) {
    return NextResponse.json({ error: "Solde insuffisant" }, { status: 400 })
  }

  // Résoudre le compte destinataire
  let resolvedDestination: { id: string; userId: string } | null = null

  if (destinationAccountId) {
    // Transfert interne (même utilisateur)
    resolvedDestination = await prisma.financialAccount.findFirst({
      where: { id: destinationAccountId, userId },
      select: { id: true, userId: true },
    })
  } else if (externalIban) {
    // IBAN externe : chercher si ce numéro existe dans le système
    const cleanIban = externalIban.replace(/\s/g, "")
    const last4 = cleanIban.slice(-4)

    // Chercher les comptes candidats par les 4 derniers chiffres
    const candidates = await prisma.financialAccount.findMany({
      where: { accountNumberLast4: last4 },
    })

    // Déchiffrer et comparer le numéro complet
    for (const candidate of candidates) {
      if (candidate.accountNumber) {
        try {
          const decrypted = decrypt(candidate.accountNumber).replace(/\s/g, "")
          if (decrypted === cleanIban) {
            resolvedDestination = candidate
            break
          }
        } catch {
          // Ignorer les erreurs de déchiffrement
        }
      }
    }
  }

  const now = new Date()

  // Si IBAN externe et compte non trouvé → échec, pas de débit
  if (externalIban && !resolvedDestination) {
    const failed = await prisma.transaction.create({
      data: {
        description,
        amount: -parsedAmount,
        type: "EXPENSE",
        date: now,
        category,
        status: "Échouée",
        financialAccountId: sourceAccountId,
      },
    })
    return NextResponse.json(failed, { status: 201 })
  }

  // Déterminer si c'est un transfert interne (même utilisateur)
  const isInternalTransfer = resolvedDestination?.userId === userId

  // 1. Débiter le compte source
  await prisma.financialAccount.update({
    where: { id: sourceAccountId },
    data: { balance: { decrement: parsedAmount } },
  })

  // 2. Créer la transaction sortante sur le compte source
  // Transfert interne → TRANSFER, sinon → EXPENSE (débit)
  const outgoing = await prisma.transaction.create({
    data: {
      description,
      amount: -parsedAmount,
      type: isInternalTransfer ? "TRANSFER" : "EXPENSE",
      date: now,
      category,
      status: "Validée",
      financialAccountId: sourceAccountId,
    },
  })

  // 3. Si destinataire trouvé : créditer + créer la transaction entrante
  if (resolvedDestination) {
    await prisma.financialAccount.update({
      where: { id: resolvedDestination.id },
      data: { balance: { increment: parsedAmount } },
    })

    // Transfert interne → TRANSFER, externe → INCOME (crédit)
    await prisma.transaction.create({
      data: {
        description,
        amount: parsedAmount,
        type: isInternalTransfer ? "TRANSFER" : "INCOME",
        date: now,
        category,
        status: "Validée",
        financialAccountId: resolvedDestination.id,
      },
    })
  }

  return NextResponse.json(outgoing, { status: 201 })
}
