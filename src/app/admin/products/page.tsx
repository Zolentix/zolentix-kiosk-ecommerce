'use client'

import { useEffect, useState } from 'react'
import { formatPrice, parseImages } from '@/lib/utils'

interface Product {
  id: string; name: string; price: number; inventory: number; published: boolean; featured: boolean
  images: string; category: { name: string }; _count: { orderItems: number }
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ price: '', inventory: '' })

  const loadProducts = () => {
    setLoading(true)
    fetch('/api/admin/products').then((r) => r.json()).then(setProducts).finally(() => setLoading(false))
  }

  useEffect(loadProducts, [])

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    loadProducts()
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadProducts()
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-kiosk-primary border-t-transparent" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products ({products.length})</h1>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-kiosk-border bg-kiosk-surface-hover/50 text-left">
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Product</th>
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Category</th>
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Price</th>
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Stock</th>
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Sales</th>
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Status</th>
                <th className="px-4 py-3 font-medium text-kiosk-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-kiosk-border last:border-0 hover:bg-kiosk-surface-hover/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={parseImages(p.images)[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-kiosk-surface-hover" />
                      <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-kiosk-text-muted">{p.category.name}</td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="input-field w-24 py-1 text-sm"
                      />
                    ) : (
                      formatPrice(p.price)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input
                        value={editForm.inventory}
                        onChange={(e) => setEditForm({ ...editForm, inventory: e.target.value })}
                        className="input-field w-20 py-1 text-sm"
                      />
                    ) : (
                      <span className={p.inventory < 10 ? 'text-kiosk-warning' : ''}>{p.inventory}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-kiosk-text-muted">{p._count.orderItems}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate(p.id, { published: !p.published })}
                        className={`badge text-xs ${p.published ? 'bg-kiosk-success/20 text-kiosk-success' : 'bg-kiosk-error/20 text-kiosk-error'}`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                      {p.featured && <span className="badge bg-kiosk-warning/20 text-kiosk-warning text-xs">Featured</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {editingId === p.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(p.id, { price: editForm.price, inventory: editForm.inventory })}
                            className="btn-ghost text-xs text-kiosk-success"
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn-ghost text-xs">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(p.id); setEditForm({ price: p.price.toString(), inventory: p.inventory.toString() }) }}
                            className="btn-ghost text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUpdate(p.id, { featured: !p.featured })}
                            className="btn-ghost text-xs"
                          >
                            {p.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="btn-ghost text-xs text-kiosk-error">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
