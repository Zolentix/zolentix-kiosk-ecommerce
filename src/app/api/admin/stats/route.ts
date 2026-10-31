import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [totalProducts, totalOrders, totalCustomers, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ])

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: revenue._sum.total || 0,
  })
}
