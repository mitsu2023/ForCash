import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/crypto"

export async function GET() {
  const accounts = await prisma.financialAccount.findMany()
  return NextResponse.json(accounts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, type, balance, currency, bank, accountNumber } = body

  // Strip spaces/dashes to get digits only for last4
  const digits = accountNumber ? accountNumber.replace(/[\s-]/g, "") : ""
  const last4 = digits.length >= 4 ? digits.slice(-4) : digits

  const account = await prisma.financialAccount.create({
    data: {
      name,
      type,
      balance: parseFloat(balance) || 0,
      currency: currency || "EUR",
      bank,
      accountNumber: accountNumber ? encrypt(accountNumber) : null,
      accountNumberLast4: last4 || null,
    },
  })

  return NextResponse.json(account, { status: 201 })
}
