import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: { include: { product: { select: { name: true, images: true, slug: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
