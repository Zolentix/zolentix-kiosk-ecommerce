'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

interface WishlistItem {
  id: string
  product: {
    id: string; name: string; slug: string; price: number; compareAt: number | null
    images: string; rating: number; reviewCount: number
    category: { name: string }
  }
}

export default function WishlistPage() {
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wishlist')
      .then((r) => {
        if (!r.ok) { router.push('/login'); return [] }
        return r.json()
      })
      .then(setItems)
      .finally(() => setLoading(false))
  }, [router])

  const handleRemove = async (productId: string) => {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-kiosk-primary border-t-transparent" />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold mb-8">Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <svg className="h-16 w-16 text-kiosk-text-dim mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-kiosk-text-muted mb-4">Your wishlist is empty.</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard product={item.product} />
              <button
                onClick={() => handleRemove(item.product.id)}
                className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-kiosk-bg/80 border border-kiosk-border flex items-center justify-center hover:bg-kiosk-error/20 hover:border-kiosk-error/50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
