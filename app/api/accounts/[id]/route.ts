import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const account = await prisma.financialAccount.findUnique({ where: { id } })

  if (!account) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 })
  }

  return NextResponse.json(account)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.financialAccount.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
