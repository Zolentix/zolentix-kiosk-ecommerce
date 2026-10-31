import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json([])

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  })

  return NextResponse.json(items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    image: JSON.parse(item.product.images)[0],
    quantity: item.quantity,
    variant: item.variant,
  })))
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, quantity = 1, variant } = await req.json()

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId_variant: { userId: user.id, productId, variant: variant || null } },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })
  } else {
    await prisma.cartItem.create({
      data: { userId: user.id, productId, quantity, variant },
    })
  }

  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, quantity, variant } = await req.json()

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { userId: user.id, productId, variant: variant || null },
    })
  } else {
    await prisma.cartItem.updateMany({
      where: { userId: user.id, productId, variant: variant || null },
      data: { quantity },
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, variant } = await req.json()
  await prisma.cartItem.deleteMany({
    where: { userId: user.id, productId, variant: variant || null },
  })

  return NextResponse.json({ ok: true })
}
