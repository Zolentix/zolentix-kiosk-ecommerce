'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatPrice, parseImages, cn } from '@/lib/utils'
import { Stars } from '@/components/ProductCard'

interface Variant { id: string; type: string; value: string; price: number | null; inventory: number }
interface Review { id: string; rating: number; title: string; body: string; createdAt: string; user: { name: string } }
interface Product {
  id: string; name: string; slug: string; description: string; price: number; compareAt: number | null
  images: string; rating: number; reviewCount: number; inventory: number
  category: { name: string; slug: string }
  variants: Variant[]; reviews: Review[]
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const { addToCart, setCartOpen } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) { router.push('/products'); return }
        setProduct(data)
        const defaults: Record<string, string> = {}
        const types = Array.from(new Set<string>(data.variants.map((v: Variant) => v.type)))
        for (const type of types) {
          const first = data.variants.find((v: Variant) => v.type === type)
          if (first) defaults[type] = first.value
        }
        setSelectedVariants(defaults)
      })
      .finally(() => setLoading(false))
  }, [slug, router])

  if (loading) return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-square bg-kiosk-surface rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 bg-kiosk-surface rounded w-1/4" />
          <div className="h-8 bg-kiosk-surface rounded w-3/4" />
          <div className="h-6 bg-kiosk-surface rounded w-1/3" />
        </div>
      </div>
    </div>
  )

  if (!product) return null

  const images = parseImages(product.images)
  const variantTypes = Array.from(new Set(product.variants.map((v) => v.type)))
  const variantStr = Object.values(selectedVariants).join(' / ') || undefined
  const variantPrice = product.variants.find(
    (v) => v.type === 'storage' && v.value === selectedVariants.storage
  )?.price

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: variantPrice || product.price,
      image: images[0],
      quantity,
      variant: variantStr,
    })
    setCartOpen(true)
  }

  const handleWishlist = async () => {
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id }),
    })
    if (res.ok) {
      const data = await res.json()
      setWishlisted(data.wishlisted)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-kiosk-text-muted mb-8">
        <Link href="/" className="hover:text-kiosk-text">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-kiosk-text">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-kiosk-text">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-kiosk-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-kiosk-surface border border-kiosk-border">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors',
                    i === selectedImage ? 'border-kiosk-primary' : 'border-kiosk-border hover:border-kiosk-primary/50'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-kiosk-text-dim uppercase tracking-wider mb-2">
            {product.category.name}
          </p>
          <h1 className="font-display text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <Stars rating={product.rating} size="md" />
            <span className="text-sm text-kiosk-text-muted">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-3xl font-bold text-kiosk-primary-light">
              {formatPrice(variantPrice || product.price)}
            </span>
            {product.compareAt && (
              <span className="text-lg text-kiosk-text-dim line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <p className="text-kiosk-text-muted leading-relaxed mt-6">{product.description}</p>

          {/* Variants */}
          {variantTypes.map((type) => {
            const options = product.variants.filter((v) => v.type === type)
            return (
              <div key={type} className="mt-6">
                <h3 className="text-sm font-semibold capitalize mb-3">
                  {type}: <span className="text-kiosk-text-muted font-normal">{selectedVariants[type]}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {options.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [type]: v.value }))}
                      className={cn(
                        'rounded-lg border px-4 py-2 text-sm transition-colors',
                        selectedVariants[type] === v.value
                          ? 'border-kiosk-primary bg-kiosk-primary/10 text-kiosk-primary-light'
                          : 'border-kiosk-border hover:border-kiosk-primary/50'
                      )}
                    >
                      {v.value}
                      {v.price && <span className="ml-1 text-xs text-kiosk-text-dim">({formatPrice(v.price)})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-kiosk-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-kiosk-text-muted hover:text-kiosk-text"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-kiosk-text-muted hover:text-kiosk-text"
              >
                +
              </button>
            </div>
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
            <button onClick={handleWishlist} className="btn-secondary px-3">
              <svg
                className={cn('h-5 w-5', wishlisted ? 'fill-kiosk-error text-kiosk-error' : '')}
                fill={wishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-kiosk-text-muted">
            <span className={product.inventory > 0 ? 'text-kiosk-success' : 'text-kiosk-error'}>
              {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
            </span>
            <span>Free shipping over $100</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-kiosk-border pt-12">
        <h2 className="section-heading mb-8">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-kiosk-text-muted">No reviews yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Stars rating={review.rating} />
                    <p className="font-semibold mt-1">{review.title}</p>
                  </div>
                  <span className="text-xs text-kiosk-text-dim">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-kiosk-text-muted">{review.body}</p>
                <p className="text-xs text-kiosk-text-dim mt-3">— {review.user.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
