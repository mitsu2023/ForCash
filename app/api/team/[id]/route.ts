import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const member = await prisma.teamMember.findUnique({ where: { id } })

  if (!member) {
    return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })
  }

  return NextResponse.json(member)
}
