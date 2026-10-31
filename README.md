# Kiosk — E-Commerce Storefront

Premium e-commerce platform built with Next.js 14, TypeScript, and Tailwind CSS. Project #3 in the [Zolentix](https://zolentix.com) portfolio.

## Quick Start

```bash
npm install
npm run db:setup    # creates SQLite DB + seeds 30 products, users, orders
npm run dev         # → http://localhost:3000
```

## Demo Accounts

| Role     | Email                        | Password |
|----------|------------------------------|----------|
| Admin    | admin@kiosk.zolentix.com     | admin123 |
| Customer | demo@kiosk.zolentix.com      | demo123  |

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom design system
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT (httpOnly cookies, `jose` + `bcryptjs`)
- **State**: Zustand (client-side cart)
- **Payments**: Mock Stripe checkout (simulated flow, no real keys)

## Features

### Storefront
- Product grid with filters (category, price range, rating) and sorting
- Product detail pages with image gallery, variant selectors (size/color/storage), reviews
- Instant search with `Ctrl+K` shortcut
- Category browsing with hero + featured products homepage
- Responsive — mobile, tablet, and desktop

### Shopping
- Persistent cart with slide-out drawer
- Full cart page with quantity controls and order summary
- Multi-step checkout: shipping → mock Stripe payment → confirmation
- Order history under account

### Customer Accounts
- Registration and login with JWT auth
- Account dashboard, order history, wishlist
- Wishlist toggle on product pages

### Admin Panel (`/admin`)
- Dashboard with revenue, product, order, and customer stats
- Products table with inline price/inventory editing, publish/unpublish, feature toggle, delete
- Orders list with status management (pending → processing → shipped → delivered)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── products/             # Product listing + detail
│   ├── cart/                 # Cart page
│   ├── checkout/             # Checkout flow
│   ├── login/                # Auth (login + register)
│   ├── account/              # Account + order history
│   ├── wishlist/             # Saved products
│   ├── admin/                # Admin dashboard, products, orders
│   └── api/                  # REST API routes
├── components/               # Shared UI components
├── lib/                      # Prisma, auth, utils, store
prisma/
├── schema.prisma             # Data model
└── seed.ts                   # 30 products, reviews, sample orders
```

## Brand System

- **Background**: `#0A0A0F` (near-black)
- **Surfaces**: `#13131C` raised panels
- **Primary**: `#6D4AFF → #8B5CF6` electric violet gradient
- **Accent**: `#22D3EE` cyan
- **Text**: `#EDEDF2` off-white
- **Fonts**: Space Grotesk (headings) + Inter (body)

## Database

Prisma with SQLite. The seed script creates:
- 5 categories, 30 products with images and variants
- Customer reviews
- 5 sample orders in various statuses
- Admin and demo customer accounts

Reset: `npx prisma db push --force-reset && npm run db:seed`

---

Built by **Zolentix** — [zolentix.com](https://zolentix.com)
