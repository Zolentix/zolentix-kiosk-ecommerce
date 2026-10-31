import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true, published: true },
    include: { category: true },
    take: 8,
  })

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })

  const newArrivals = await prisma.product.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-kiosk-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-kiosk-primary-light tracking-wider uppercase mb-4">
              Curated Collection
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Premium products,{' '}
              <span className="gradient-text">thoughtfully curated</span>
            </h1>
            <p className="mt-6 text-lg text-kiosk-text-muted leading-relaxed max-w-lg">
              Discover a handpicked selection of electronics, lifestyle gear, and everyday essentials — designed for people who care about quality.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/products" className="btn-primary">
                Shop All Products
              </Link>
              <Link href="/products?category=electronics" className="btn-secondary">
                Browse Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="section-heading mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="card-hover group relative overflow-hidden aspect-[4/3]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-display font-semibold text-sm">{cat.name}</h3>
                <p className="text-xs text-kiosk-text-muted">{cat._count.products} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading">Featured Products</h2>
          <Link href="/products" className="btn-ghost text-sm text-kiosk-primary-light">
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="card overflow-hidden bg-gradient-to-r from-kiosk-primary/10 via-kiosk-surface to-kiosk-accent/5">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                Free shipping on orders over $100
              </h3>
              <p className="mt-3 text-kiosk-text-muted">
                Plus easy 30-day returns on everything. No questions asked.
              </p>
            </div>
            <Link href="/products" className="btn-primary shrink-0">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="section-heading mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
