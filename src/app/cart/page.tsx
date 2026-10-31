'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore()
  const total = cartTotal()
  const shipping = total > 100 ? 0 : 9.99
  const tax = Math.round(total * 0.08 * 100) / 100

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <svg className="h-20 w-20 text-kiosk-text-dim mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-kiosk-text-muted mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.variant}`} className="card p-4 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 rounded-lg object-cover bg-kiosk-surface-hover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold">{item.name}</h3>
                {item.variant && <p className="text-sm text-kiosk-text-muted">{item.variant}</p>}
                <p className="font-semibold text-kiosk-primary-light mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center rounded-lg border border-kiosk-border">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                      className="px-3 py-1 text-sm"
                    >-</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                      className="px-3 py-1 text-sm"
                    >+</button>
                  </div>
                  <span className="text-sm text-kiosk-text-muted">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId, item.variant)}
                    className="ml-auto text-sm text-kiosk-text-dim hover:text-kiosk-error"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-kiosk-text-muted">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kiosk-text-muted">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kiosk-text-muted">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-kiosk-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-kiosk-primary-light">{formatPrice(total + shipping + tax)}</span>
              </div>
            </div>
            {total < 100 && (
              <p className="text-xs text-kiosk-text-dim mt-3">
                Add {formatPrice(100 - total)} more for free shipping
              </p>
            )}
            <Link href="/checkout" className="btn-primary w-full text-center mt-6">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
