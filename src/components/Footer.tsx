import Link from 'next/link'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-kiosk-border bg-kiosk-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={24} />
              <span className="font-display text-base font-bold">Kiosk</span>
            </div>
            <p className="text-sm text-kiosk-text-muted leading-relaxed">
              Premium products, curated for the modern lifestyle. A Zolentix portfolio project.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {['Electronics', 'Clothing', 'Home & Living', 'Audio', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase().replace(/ & /g, '-')}`}
                    className="text-sm text-kiosk-text-muted hover:text-kiosk-text transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sign In', href: '/login' },
                { label: 'Orders', href: '/account/orders' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'Cart', href: '/cart' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-kiosk-text-muted hover:text-kiosk-text transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Built by</h4>
            <p className="text-sm text-kiosk-text-muted leading-relaxed">
              Zolentix — software agency building premium digital products. This is project #3 of 9 in our portfolio.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-kiosk-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-kiosk-text-dim">
            &copy; {new Date().getFullYear()} Kiosk by Zolentix. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-kiosk-text-dim">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
