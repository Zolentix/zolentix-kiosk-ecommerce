'use client'

import Link from 'next/link'
import { formatPrice, parseImages, cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAt?: number | null
    images: string
    rating: number
    reviewCount: number
    category?: { name: string }
  }
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
            star <= Math.round(rating) ? 'text-kiosk-warning' : 'text-kiosk-border'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export { Stars }

export function ProductCard({ product }: ProductCardProps) {
  const images = parseImages(product.images)
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card-hover overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-kiosk-surface-hover">
          <img
            src={images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount && (
            <span className="absolute top-3 left-3 badge bg-kiosk-error text-white text-xs font-bold">
              -{discount}%
            </span>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-kiosk-text-dim uppercase tracking-wider mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-kiosk-primary-light transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <Stars rating={product.rating} />
            <span className="text-xs text-kiosk-text-dim">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display font-bold text-kiosk-primary-light">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-xs text-kiosk-text-dim line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
