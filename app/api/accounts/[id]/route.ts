import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
import { decrypt } from "@/lib/crypto"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const account = await prisma.financialAccount.findFirst({ where: { id, userId } })

  if (!account) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 })
  }

  return NextResponse.json({
    ...account,
    accountNumber: account.accountNumber ? decrypt(account.accountNumber) : null,
  })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const account = await prisma.financialAccount.findFirst({ where: { id, userId } })

  if (!account) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 })
  }

  await prisma.financialAccount.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
