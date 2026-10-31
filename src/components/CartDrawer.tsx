'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore()

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md animate-slide-in-right">
        <div className="flex h-full flex-col bg-kiosk-bg border-l border-kiosk-border">
          <div className="flex items-center justify-between border-b border-kiosk-border px-6 py-4">
            <h2 className="font-display text-lg font-bold">Cart ({cart.length})</h2>
            <button onClick={() => setCartOpen(false)} className="btn-ghost p-1">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="h-16 w-16 text-kiosk-text-dim mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-kiosk-text-muted mb-4">Your cart is empty</p>
                <button onClick={() => setCartOpen(false)} className="btn-primary text-sm">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={`${item.productId}-${item.variant}`} className="flex gap-4 card p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover bg-kiosk-surface-hover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-kiosk-text-muted mt-0.5">{item.variant}</p>
                      )}
                      <p className="text-sm font-semibold text-kiosk-primary-light mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                          className="h-6 w-6 rounded border border-kiosk-border flex items-center justify-center text-xs hover:bg-kiosk-surface-hover"
                        >
                          -
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                          className="h-6 w-6 rounded border border-kiosk-border flex items-center justify-center text-xs hover:bg-kiosk-surface-hover"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variant)}
                          className="ml-auto text-kiosk-text-dim hover:text-kiosk-error text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-kiosk-border px-6 py-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-kiosk-text-muted">Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal())}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="btn-primary w-full text-center"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="btn-secondary w-full text-center text-sm"
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
