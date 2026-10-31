'use client'

import { useEffect, useState } from 'react'
import { formatPrice, getStatusColor } from '@/lib/utils'

interface OrderItem { id: string; quantity: number; price: number; product: { name: string } }
interface Order {
  id: string; status: string; total: number; createdAt: string
  user: { name: string; email: string }
  items: OrderItem[]
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    setLoading(true)
    fetch('/api/admin/orders').then((r) => r.json()).then(setOrders).finally(() => setLoading(false))
  }

  useEffect(loadOrders, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    loadOrders()
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-kiosk-primary border-t-transparent" />
    </div>
  )

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders ({orders.length})</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-kiosk-surface-hover/50 border-b border-kiosk-border gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs text-kiosk-text-dim">Order</p>
                  <p className="font-mono text-sm">{order.id.slice(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-xs text-kiosk-text-dim">Customer</p>
                  <p className="text-sm">{order.user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-kiosk-text-dim">Date</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-kiosk-text-dim">Total</p>
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="input-field py-1.5 text-sm w-auto"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-kiosk-surface capitalize">{s}</option>
                  ))}
                </select>
                <span className={`badge capitalize text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <ul className="space-y-1 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-kiosk-text-muted">
                    <span>{item.product.name} &times; {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
