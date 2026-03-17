import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const transaction = await prisma.transaction.findFirst({
    where: { id, financialAccount: { userId } },
  })

  if (!transaction) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 })
  }

  return NextResponse.json(transaction)
}
