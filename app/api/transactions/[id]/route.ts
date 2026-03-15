import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const transaction = await prisma.transaction.findUnique({ where: { id } })

  if (!transaction) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 })
  }

  return NextResponse.json(transaction)
}
