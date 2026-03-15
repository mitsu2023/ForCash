import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const accountId = searchParams.get("accountId")

  const transactions = await prisma.transaction.findMany({
    where: accountId ? { financialAccountId: accountId } : undefined,
    orderBy: { date: "desc" },
  })

  return NextResponse.json(transactions)
}
