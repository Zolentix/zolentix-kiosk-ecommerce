'use client'

import { create } from 'zustand'

interface CartItemData {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

interface StoreState {
  cart: CartItemData[]
  cartOpen: boolean
  searchOpen: boolean
  setCart: (items: CartItemData[]) => void
  addToCart: (item: Omit<CartItemData, 'id'>) => void
  removeFromCart: (productId: string, variant?: string) => void
  updateQuantity: (productId: string, quantity: number, variant?: string) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  cartTotal: () => number
  cartCount: () => number
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  cartOpen: false,
  searchOpen: false,

  setCart: (items) => set({ cart: items }),

  addToCart: (item) => set((state) => {
    const existing = state.cart.find(
      (c) => c.productId === item.productId && c.variant === item.variant
    )
    if (existing) {
      return {
        cart: state.cart.map((c) =>
          c.productId === item.productId && c.variant === item.variant
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        ),
      }
    }
    return { cart: [...state.cart, { ...item, id: crypto.randomUUID() }] }
  }),

  removeFromCart: (productId, variant) =>
    set((state) => ({
      cart: state.cart.filter(
        (c) => !(c.productId === productId && c.variant === variant)
      ),
    })),

  updateQuantity: (productId, quantity, variant) =>
    set((state) => ({
      cart: quantity <= 0
        ? state.cart.filter(
            (c) => !(c.productId === productId && c.variant === variant)
          )
        : state.cart.map((c) =>
            c.productId === productId && c.variant === variant
              ? { ...c, quantity }
              : c
          ),
    })),

  clearCart: () => set({ cart: [] }),
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
}))
