'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { CartDrawer } from './CartDrawer'
import { SearchModal } from './SearchModal'

export function Header() {
  const pathname = usePathname()
  const { cartCount, toggleCart, setSearchOpen } = useStore()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const count = cartCount()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => null)
  }, [pathname])

  const nav = [
    { label: 'Shop', href: '/products' },
    { label: 'Electronics', href: '/products?category=electronics' },
    { label: 'Clothing', href: '/products?category=clothing' },
    { label: 'Audio', href: '/products?category=audio' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-kiosk-border bg-kiosk-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-display text-lg font-bold tracking-tight">Kiosk</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-kiosk-text bg-kiosk-surface'
                      : 'text-kiosk-text-muted hover:text-kiosk-text hover:bg-kiosk-surface/50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-ghost p-2"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {user && (
              <Link href="/wishlist" className="btn-ghost p-2" aria-label="Wishlist">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            )}

            <button
              onClick={toggleCart}
              className="btn-ghost relative p-2"
              aria-label="Cart"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-kiosk-primary text-[10px] font-bold text-white min-w-[18px] h-[18px]">
                  {count}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="btn-ghost text-sm">
                  {user.name}
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="badge bg-kiosk-primary/20 text-kiosk-primary-light text-xs">
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-ghost text-sm">
                Sign in
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-ghost p-2 md:hidden"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-kiosk-border bg-kiosk-surface p-4 md:hidden animate-fade-in">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-kiosk-text-muted hover:text-kiosk-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <CartDrawer />
      <SearchModal />
    </>
  )
}
