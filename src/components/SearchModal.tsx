'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatPrice, parseImages } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  images: string
  category: { name: string }
}

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) setResults(await res.json())
      } catch { /* ignore */ }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [searchOpen, setSearchOpen])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 animate-slide-up">
        <div className="card overflow-hidden shadow-2xl shadow-kiosk-primary/10">
          <div className="flex items-center gap-3 border-b border-kiosk-border px-4">
            <svg className="h-5 w-5 text-kiosk-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent py-4 text-kiosk-text placeholder:text-kiosk-text-dim focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-kiosk-border px-1.5 py-0.5 text-[10px] text-kiosk-text-dim">
              ESC
            </kbd>
          </div>

          {query.trim() && (
            <div className="max-h-80 overflow-y-auto p-2">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-kiosk-primary border-t-transparent" />
                </div>
              ) : results.length === 0 ? (
                <p className="py-8 text-center text-sm text-kiosk-text-muted">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul>
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-kiosk-surface-hover transition-colors"
                      >
                        <img
                          src={parseImages(product.images)[0]}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover bg-kiosk-surface-hover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-kiosk-text-muted">{product.category.name}</p>
                        </div>
                        <span className="text-sm font-semibold text-kiosk-primary-light">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="p-4 text-center text-sm text-kiosk-text-dim">
              Type to search products, categories, and more
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
