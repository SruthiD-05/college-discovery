import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      placement: true,
      courses: true,
      reviews: true,
    }
  })

  if (!college) {
    return NextResponse.json({ error: 'College not found' }, { status: 404 })
  }

  return NextResponse.json(college)
}