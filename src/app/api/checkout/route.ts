import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { shipping, items } = await req.json()

  if (!items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const shippingCost = subtotal > 100 ? 0 : 9.99
  const total = Math.round((subtotal + tax + shippingCost) * 100) / 100

  // Mock Stripe: simulate a short delay + always succeed
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'processing',
      subtotal,
      tax,
      shipping: shippingCost,
      total,
      shippingName: shipping?.name || user.name,
      shippingEmail: shipping?.email || '',
      shippingAddr: shipping?.address || '',
      shippingCity: shipping?.city || '',
      shippingZip: shipping?.zip || '',
      paymentLast4: '4242',
      items: {
        create: items.map((item: { productId: string; quantity: number; price: number; variant?: string }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  })

  // Clear the user's cart
  await prisma.cartItem.deleteMany({ where: { userId: user.id } })

  return NextResponse.json({
    success: true,
    orderId: order.id,
    total: order.total,
    mockPayment: {
      id: `pi_mock_${Date.now()}`,
      status: 'succeeded',
      last4: '4242',
      brand: 'visa',
    },
  })
}
