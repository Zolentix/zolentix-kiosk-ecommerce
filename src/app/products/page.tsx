'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAt: number | null
  images: string
  rating: number
  reviewCount: number
  category: { name: string; slug: string }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const CATEGORIES = [
  { slug: '', label: 'All' },
  { slug: 'electronics', label: 'Electronics' },
  { slug: 'clothing', label: 'Clothing' },
  { slug: 'home-living', label: 'Home & Living' },
  { slug: 'accessories', label: 'Accessories' },
  { slug: 'audio', label: 'Audio' },
]

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $50', min: '', max: '50' },
  { label: '$50 - $100', min: '50', max: '100' },
  { label: '$100 - $250', min: '100', max: '250' },
  { label: '$250+', min: '250', max: '' },
]

function ProductsInner() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState(0)
  const [minRating, setMinRating] = useState('')

  // Re-sync filters when the URL query changes (e.g. clicking header nav links)
  useEffect(() => {
    setCategory(searchParams.get('category') || '')
    setSort(searchParams.get('sort') || 'newest')
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('sort', sort)
    if (PRICE_RANGES[priceRange].min) params.set('minPrice', PRICE_RANGES[priceRange].min)
    if (PRICE_RANGES[priceRange].max) params.set('maxPrice', PRICE_RANGES[priceRange].max)
    if (minRating) params.set('minRating', minRating)
    params.set('limit', '24')

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data.products); setTotal(data.total) })
      .finally(() => setLoading(false))
  }, [sort, category, priceRange, minRating])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          {category ? CATEGORIES.find((c) => c.slug === category)?.label || 'Products' : 'All Products'}
        </h1>
        <p className="text-kiosk-text-muted mt-1">{total} products</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-sm font-semibold mb-3">Category</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setCategory(cat.slug)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm text-left transition-colors',
                      category === cat.slug
                        ? 'bg-kiosk-primary/20 text-kiosk-primary-light font-medium'
                        : 'text-kiosk-text-muted hover:text-kiosk-text hover:bg-kiosk-surface'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold mb-3">Price</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {PRICE_RANGES.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceRange(i)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm text-left transition-colors',
                      priceRange === i
                        ? 'bg-kiosk-primary/20 text-kiosk-primary-light font-medium'
                        : 'text-kiosk-text-muted hover:text-kiosk-text hover:bg-kiosk-surface'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold mb-3">Rating</h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {['', '4', '3'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm text-left transition-colors',
                      minRating === r
                        ? 'bg-kiosk-primary/20 text-kiosk-primary-light font-medium'
                        : 'text-kiosk-text-muted hover:text-kiosk-text hover:bg-kiosk-surface'
                    )}
                  >
                    {r ? `${r}+ Stars` : 'All Ratings'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-kiosk-text-muted">{total} results</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto py-2 pr-8 text-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-kiosk-surface">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-kiosk-surface-hover rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-kiosk-surface-hover rounded w-1/3" />
                    <div className="h-4 bg-kiosk-surface-hover rounded w-2/3" />
                    <div className="h-4 bg-kiosk-surface-hover rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-kiosk-text-muted">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">Loading…</div>}>
      <ProductsInner />
    </Suspense>
  )
}
