'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useStore()
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'done'>('shipping')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' })
  const [orderId, setOrderId] = useState('')

  const total = cartTotal()
  const shipping = total > 100 ? 0 : 9.99
  const tax = Math.round(total * 0.08 * 100) / 100

  if (cart.length === 0 && step !== 'done') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Nothing to check out</h1>
        <a href="/products" className="btn-primary">Shop Now</a>
      </div>
    )
  }

  const handleCheckout = async () => {
    setStep('processing')
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: form,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Checkout failed')
      }

      const data = await res.json()
      setOrderId(data.orderId)
      clearCart()
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed')
      setStep('payment')
    }
  }

  if (step === 'done') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-kiosk-success/20 flex items-center justify-center">
          <svg className="h-8 w-8 text-kiosk-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-kiosk-text-muted mb-2">
          Thank you for your purchase. Your order ID is:
        </p>
        <p className="font-mono text-sm text-kiosk-primary-light bg-kiosk-surface inline-block px-3 py-1 rounded mb-6">
          {orderId}
        </p>
        <div className="flex justify-center gap-4">
          <a href="/account/orders" className="btn-primary">View Orders</a>
          <a href="/products" className="btn-secondary">Continue Shopping</a>
        </div>
      </div>
    )
  }

  if (step === 'processing') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-kiosk-primary/20 flex items-center justify-center animate-pulse">
          <svg className="h-8 w-8 text-kiosk-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold mb-2">Processing Payment...</h2>
        <p className="text-kiosk-text-muted text-sm">
          Mock Stripe is verifying your card ending in 4242
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          {/* Steps */}
          <div className="flex gap-4 mb-6">
            {['shipping', 'payment'].map((s, i) => (
              <button
                key={s}
                onClick={() => s === 'shipping' && setStep('shipping')}
                className={`flex items-center gap-2 text-sm font-medium ${
                  step === s ? 'text-kiosk-primary-light' : 'text-kiosk-text-dim'
                }`}
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  step === s ? 'bg-kiosk-primary text-white' : 'bg-kiosk-surface border border-kiosk-border'
                }`}>
                  {i + 1}
                </span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {step === 'shipping' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-kiosk-text-muted mb-1">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-kiosk-text-muted mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-kiosk-text-muted mb-1">Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input-field"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-kiosk-text-muted mb-1">City</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="input-field"
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-kiosk-text-muted mb-1">ZIP Code</label>
                    <input
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="input-field"
                      placeholder="94105"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!form.name || !form.email || !form.address}
                  className="btn-primary w-full mt-4"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Payment (Mock Stripe)</h2>
              <div className="rounded-lg border border-kiosk-border bg-kiosk-surface-hover p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-12 rounded bg-gradient-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Test Card</p>
                    <p className="text-xs text-kiosk-text-dim">**** **** **** 4242</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-kiosk-text-dim mb-1">Card Number</label>
                    <input className="input-field text-sm" value="4242 4242 4242 4242" readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-kiosk-text-dim mb-1">Exp</label>
                      <input className="input-field text-sm" value="12/28" readOnly />
                    </div>
                    <div>
                      <label className="block text-xs text-kiosk-text-dim mb-1">CVC</label>
                      <input className="input-field text-sm" value="123" readOnly />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-kiosk-accent mt-3">
                  This is a mock Stripe checkout. No real payment will be processed.
                </p>
              </div>

              {error && (
                <p className="text-sm text-kiosk-error mb-4">{error}</p>
              )}

              <button onClick={handleCheckout} className="btn-primary w-full">
                Pay {formatPrice(total + shipping + tax)}
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold mb-4">Order Summary</h2>
            <ul className="space-y-3 mb-4">
              {cart.map((item) => (
                <li key={`${item.productId}-${item.variant}`} className="flex items-center gap-3">
                  <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-kiosk-surface-hover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-kiosk-text-dim">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-kiosk-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-kiosk-text-muted">
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-kiosk-text-muted">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-kiosk-text-muted">
                <span>Tax</span><span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-kiosk-border">
                <span>Total</span>
                <span className="text-kiosk-primary-light">{formatPrice(total + shipping + tax)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
