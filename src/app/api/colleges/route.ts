import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const state = searchParams.get('state') || ''
  const type = searchParams.get('type') || ''

  const colleges = await prisma.college.findMany({
    where: {
      AND: [
        search ? { name: { contains: search, mode: 'insensitive' } } : {},
        state ? { state: { equals: state } } : {},
        type ? { type: { equals: type } } : {},
      ]
    },
    include: { placement: true },
    orderBy: { rating: 'desc' }
  })

  return NextResponse.json(colleges)
}