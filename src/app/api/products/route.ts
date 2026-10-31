import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const minRating = searchParams.get('minRating')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')

  const where: Record<string, unknown> = { published: true }
  if (category) where.category = { slug: category }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
  }
  if (minRating) where.rating = { gte: parseFloat(minRating) }

  const orderBy: Record<string, string> =
    sort === 'price-asc' ? { price: 'asc' } :
    sort === 'price-desc' ? { price: 'desc' } :
    sort === 'rating' ? { rating: 'desc' } :
    sort === 'popular' ? { reviewCount: 'desc' } :
    { createdAt: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) })
}
