'use client'

import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats)
  }, [])

  const cards = stats ? [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: 'text-kiosk-success' },
    { label: 'Products', value: stats.totalProducts.toString(), color: 'text-kiosk-primary-light' },
    { label: 'Orders', value: stats.totalOrders.toString(), color: 'text-kiosk-accent' },
    { label: 'Customers', value: stats.totalCustomers.toString(), color: 'text-kiosk-warning' },
  ] : []

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

      {!stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-3 bg-kiosk-surface-hover rounded w-1/2 mb-3" />
              <div className="h-8 bg-kiosk-surface-hover rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="card p-6">
              <p className="text-sm text-kiosk-text-muted">{card.label}</p>
              <p className={`font-display text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
