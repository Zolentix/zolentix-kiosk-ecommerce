'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User { id: string; name: string; email: string; role: string }

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { router.push('/login'); return }
        setUser(data)
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading || !user) return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-kiosk-primary border-t-transparent" />
    </div>
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold mb-8">My Account</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="font-display text-xl font-bold text-white">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-kiosk-text-muted">{user.email}</p>
            {user.role === 'admin' && (
              <span className="badge bg-kiosk-primary/20 text-kiosk-primary-light text-xs mt-1">Admin</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="card-hover p-6 group">
          <svg className="h-8 w-8 text-kiosk-text-dim group-hover:text-kiosk-primary mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="font-display font-semibold">Order History</h3>
          <p className="text-sm text-kiosk-text-muted mt-1">View past orders and track shipments</p>
        </Link>

        <Link href="/wishlist" className="card-hover p-6 group">
          <svg className="h-8 w-8 text-kiosk-text-dim group-hover:text-kiosk-primary mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="font-display font-semibold">Wishlist</h3>
          <p className="text-sm text-kiosk-text-muted mt-1">Products you&apos;ve saved for later</p>
        </Link>

        {user.role === 'admin' && (
          <Link href="/admin" className="card-hover p-6 group sm:col-span-2">
            <svg className="h-8 w-8 text-kiosk-text-dim group-hover:text-kiosk-primary mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-display font-semibold">Admin Panel</h3>
            <p className="text-sm text-kiosk-text-muted mt-1">Manage products, orders, and inventory</p>
          </Link>
        )}
      </div>

      <button onClick={handleLogout} className="btn-secondary w-full mt-8">
        Sign Out
      </button>
    </div>
  )
}
