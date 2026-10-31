import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    include: { category: true, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const data = await req.json()
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description || '',
      price: parseFloat(data.price),
      compareAt: data.compareAt ? parseFloat(data.compareAt) : null,
      images: JSON.stringify(data.images || ['https://picsum.photos/seed/new/600/600']),
      categoryId: data.categoryId,
      inventory: parseInt(data.inventory || '0'),
      featured: data.featured || false,
    },
  })

  return NextResponse.json(product)
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const data = await req.json()
  const product = await prisma.product.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price !== undefined ? parseFloat(data.price) : undefined,
      compareAt: data.compareAt !== undefined ? (data.compareAt ? parseFloat(data.compareAt) : null) : undefined,
      categoryId: data.categoryId,
      inventory: data.inventory !== undefined ? parseInt(data.inventory) : undefined,
      featured: data.featured,
      published: data.published,
    },
  })

  return NextResponse.json(product)
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await req.json()
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
