import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const accounts = await prisma.financialAccount.findMany()
  return NextResponse.json(accounts)
}
