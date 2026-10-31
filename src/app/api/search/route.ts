import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim()
  if (!q) return NextResponse.json([])

  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { category: { name: { contains: q } } },
      ],
    },
    include: { category: { select: { name: true } } },
    take: 8,
  })

  return NextResponse.json(products)
}
