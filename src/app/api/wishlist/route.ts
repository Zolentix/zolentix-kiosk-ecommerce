import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json([])

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId } = await req.json()

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  })

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } })
    return NextResponse.json({ wishlisted: false })
  }

  await prisma.wishlistItem.create({ data: { userId: user.id, productId } })
  return NextResponse.json({ wishlisted: true })
}
