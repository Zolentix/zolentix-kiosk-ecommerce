'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, getStatusColor, parseImages } from '@/lib/utils'

interface OrderItem {
  id: string
  quantity: number
  price: number
  variant: string | null
  product: { name: string; images: string; slug: string }
}

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => {
        if (!r.ok) { router.push('/login'); return [] }
        return r.json()
      })
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-kiosk-primary border-t-transparent" />
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Order History</h1>
        <Link href="/account" className="btn-ghost text-sm">&larr; Account</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 card p-8">
          <p className="text-kiosk-text-muted mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-kiosk-surface-hover/50 border-b border-kiosk-border">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-kiosk-text-dim">Order ID</p>
                    <p className="font-mono text-sm">{order.id.slice(0, 12)}...</p>
                  </div>
                  <div>
                    <p className="text-xs text-kiosk-text-dim">Date</p>
                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className={`badge capitalize ${getStatusColor(order.status)} bg-current/10`}>
                    {order.status}
                  </span>
                  <span className="font-display font-bold">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={parseImages(item.product.images)[0]}
                      alt={item.product.name}
                      className="h-14 w-14 rounded-lg object-cover bg-kiosk-surface-hover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-kiosk-primary-light">
                        {item.product.name}
                      </Link>
                      {item.variant && <p className="text-xs text-kiosk-text-dim">{item.variant}</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p>{formatPrice(item.price)} &times; {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
