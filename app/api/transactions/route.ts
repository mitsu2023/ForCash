import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"

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
