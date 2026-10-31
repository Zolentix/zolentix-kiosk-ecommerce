import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

const PLACEHOLDER_IMG = (id: number) =>
  `https://picsum.photos/seed/kiosk${id}/600/600`

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const admin = await prisma.user.create({
    data: {
      email: 'admin@kiosk.zolentix.com',
      password: hashSync('admin123', 10),
      name: 'Kiosk Admin',
      role: 'admin',
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: 'demo@kiosk.zolentix.com',
      password: hashSync('demo123', 10),
      name: 'Demo Customer',
      role: 'customer',
    },
  })

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Electronics', slug: 'electronics', image: PLACEHOLDER_IMG(100) } }),
    prisma.category.create({ data: { name: 'Clothing', slug: 'clothing', image: PLACEHOLDER_IMG(101) } }),
    prisma.category.create({ data: { name: 'Home & Living', slug: 'home-living', image: PLACEHOLDER_IMG(102) } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories', image: PLACEHOLDER_IMG(103) } }),
    prisma.category.create({ data: { name: 'Audio', slug: 'audio', image: PLACEHOLDER_IMG(104) } }),
  ])

  const [electronics, clothing, homeLiving, accessories, audio] = categories

  const products = [
    { name: 'Quantum Pro Laptop', slug: 'quantum-pro-laptop', description: 'Ultra-thin 14" laptop with M3 chip, 16GB RAM, and 512GB SSD. Perfect for creators and developers.', price: 1299.99, compareAt: 1499.99, categoryId: electronics.id, inventory: 45, rating: 4.8, reviewCount: 124, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(1), PLACEHOLDER_IMG(2), PLACEHOLDER_IMG(3)]) },
    { name: 'NeoPixel 4K Monitor', slug: 'neopixel-4k-monitor', description: '27" 4K HDR monitor with 144Hz refresh rate. Nano-IPS panel with 98% DCI-P3 coverage.', price: 549.99, compareAt: 699.99, categoryId: electronics.id, inventory: 30, rating: 4.6, reviewCount: 89, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(4), PLACEHOLDER_IMG(5)]) },
    { name: 'HyperDock USB-C Hub', slug: 'hyperdock-usb-c-hub', description: '12-in-1 USB-C hub with dual HDMI, ethernet, SD card reader, and 100W power delivery.', price: 79.99, categoryId: electronics.id, inventory: 150, rating: 4.5, reviewCount: 67, images: JSON.stringify([PLACEHOLDER_IMG(6)]) },
    { name: 'ArcField Wireless Charger', slug: 'arcfield-wireless-charger', description: 'Qi2 wireless charging pad with magnetic alignment. Charges through cases up to 5mm.', price: 39.99, categoryId: electronics.id, inventory: 200, rating: 4.3, reviewCount: 45, images: JSON.stringify([PLACEHOLDER_IMG(7)]) },
    { name: 'Stealth Mechanical Keyboard', slug: 'stealth-mechanical-keyboard', description: 'Low-profile mechanical keyboard with hot-swap switches, RGB backlight, and aluminum frame.', price: 149.99, compareAt: 179.99, categoryId: electronics.id, inventory: 75, rating: 4.7, reviewCount: 203, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(8), PLACEHOLDER_IMG(9)]) },
    { name: 'Obsidian Wireless Mouse', slug: 'obsidian-wireless-mouse', description: 'Ergonomic wireless mouse with 25K DPI sensor, 70-hour battery, and USB-C charging.', price: 69.99, categoryId: electronics.id, inventory: 120, rating: 4.4, reviewCount: 56, images: JSON.stringify([PLACEHOLDER_IMG(10)]) },

    { name: 'Merino Wool Crew Neck', slug: 'merino-wool-crew-neck', description: 'Premium 100% merino wool sweater. Temperature regulating, odor resistant, and incredibly soft.', price: 89.99, compareAt: 120.00, categoryId: clothing.id, inventory: 60, rating: 4.7, reviewCount: 88, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(11), PLACEHOLDER_IMG(12)]) },
    { name: 'Tech Fleece Joggers', slug: 'tech-fleece-joggers', description: 'Slim-fit joggers with zippered pockets and tapered leg. Brushed fleece interior.', price: 64.99, categoryId: clothing.id, inventory: 80, rating: 4.5, reviewCount: 134, images: JSON.stringify([PLACEHOLDER_IMG(13)]) },
    { name: 'Graphene Down Jacket', slug: 'graphene-down-jacket', description: 'Ultralight puffer jacket with graphene-infused down. Packs into its own pocket.', price: 199.99, compareAt: 249.99, categoryId: clothing.id, inventory: 35, rating: 4.8, reviewCount: 72, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(14), PLACEHOLDER_IMG(15)]) },
    { name: 'Performance Henley', slug: 'performance-henley', description: 'Moisture-wicking henley with four-way stretch. Anti-microbial silver-ion treatment.', price: 44.99, categoryId: clothing.id, inventory: 100, rating: 4.3, reviewCount: 41, images: JSON.stringify([PLACEHOLDER_IMG(16)]) },
    { name: 'Stretch Chinos', slug: 'stretch-chinos', description: 'Classic chinos with 2% elastane for comfort. Water-resistant DWR coating.', price: 74.99, categoryId: clothing.id, inventory: 90, rating: 4.6, reviewCount: 95, images: JSON.stringify([PLACEHOLDER_IMG(17)]) },
    { name: 'Titanium Frame Sunglasses', slug: 'titanium-frame-sunglasses', description: 'Lightweight titanium frames with polarized Carl Zeiss lenses. UV400 protection.', price: 159.99, categoryId: clothing.id, inventory: 40, rating: 4.4, reviewCount: 33, images: JSON.stringify([PLACEHOLDER_IMG(18)]) },

    { name: 'Smart LED Desk Lamp', slug: 'smart-led-desk-lamp', description: 'Adjustable desk lamp with 5 color temperatures and brightness levels. USB charging port.', price: 59.99, categoryId: homeLiving.id, inventory: 70, rating: 4.5, reviewCount: 62, images: JSON.stringify([PLACEHOLDER_IMG(19)]) },
    { name: 'Ceramic Pour-Over Set', slug: 'ceramic-pour-over-set', description: 'Handcrafted ceramic dripper with thermal carafe. Includes 100 paper filters.', price: 48.99, categoryId: homeLiving.id, inventory: 55, rating: 4.6, reviewCount: 78, images: JSON.stringify([PLACEHOLDER_IMG(20)]) },
    { name: 'Modular Desk Organizer', slug: 'modular-desk-organizer', description: 'Stackable walnut and steel desk organizer. Magnetic connections for flexible configurations.', price: 34.99, categoryId: homeLiving.id, inventory: 85, rating: 4.2, reviewCount: 29, images: JSON.stringify([PLACEHOLDER_IMG(21)]) },
    { name: 'Aroma Diffuser Pro', slug: 'aroma-diffuser-pro', description: 'Ultrasonic aroma diffuser with ambient lighting. 500ml tank, runs 12 hours.', price: 42.99, categoryId: homeLiving.id, inventory: 110, rating: 4.4, reviewCount: 51, images: JSON.stringify([PLACEHOLDER_IMG(22)]) },
    { name: 'Weighted Blanket 15lb', slug: 'weighted-blanket-15lb', description: 'Glass bead weighted blanket with cooling bamboo cover. Machine washable.', price: 79.99, compareAt: 99.99, categoryId: homeLiving.id, inventory: 40, rating: 4.7, reviewCount: 167, images: JSON.stringify([PLACEHOLDER_IMG(23)]) },
    { name: 'Smart Plant Monitor', slug: 'smart-plant-monitor', description: 'Bluetooth soil monitor tracking moisture, light, temperature and nutrients. App controlled.', price: 29.99, categoryId: homeLiving.id, inventory: 130, rating: 4.1, reviewCount: 38, images: JSON.stringify([PLACEHOLDER_IMG(24)]) },

    { name: 'Carbon Fiber Wallet', slug: 'carbon-fiber-wallet', description: 'RFID-blocking slim wallet with carbon fiber weave. Holds 12 cards plus cash.', price: 54.99, categoryId: accessories.id, inventory: 95, rating: 4.5, reviewCount: 83, images: JSON.stringify([PLACEHOLDER_IMG(25)]) },
    { name: 'Titanium Watch Band', slug: 'titanium-watch-band', description: 'Grade 5 titanium link band compatible with Apple Watch. Butterfly clasp.', price: 89.99, categoryId: accessories.id, inventory: 50, rating: 4.6, reviewCount: 44, images: JSON.stringify([PLACEHOLDER_IMG(26)]) },
    { name: 'Tech Sling Bag', slug: 'tech-sling-bag', description: 'Water-resistant sling bag with padded tablet pocket, cable pass-through, and RFID pocket.', price: 64.99, categoryId: accessories.id, inventory: 65, rating: 4.4, reviewCount: 71, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(27)]) },
    { name: 'Leather AirTag Keychain', slug: 'leather-airtag-keychain', description: 'Full-grain Horween leather keychain for AirTag. Saddle-stitched by hand.', price: 24.99, categoryId: accessories.id, inventory: 180, rating: 4.3, reviewCount: 52, images: JSON.stringify([PLACEHOLDER_IMG(28)]) },

    { name: 'Nova ANC Headphones', slug: 'nova-anc-headphones', description: 'Over-ear ANC headphones with 40mm planar drivers. 60-hour battery, multipoint Bluetooth.', price: 249.99, compareAt: 299.99, categoryId: audio.id, inventory: 55, rating: 4.8, reviewCount: 312, featured: true, images: JSON.stringify([PLACEHOLDER_IMG(29), PLACEHOLDER_IMG(30)]) },
    { name: 'Pulse TWS Earbuds', slug: 'pulse-tws-earbuds', description: 'True wireless earbuds with hybrid ANC, spatial audio, and wireless charging case.', price: 129.99, categoryId: audio.id, inventory: 90, rating: 4.6, reviewCount: 189, images: JSON.stringify([PLACEHOLDER_IMG(31)]) },
    { name: 'BassCore Portable Speaker', slug: 'basscore-portable-speaker', description: 'IP67 waterproof Bluetooth speaker with 360° sound. 20-hour battery, USB-C.', price: 89.99, categoryId: audio.id, inventory: 70, rating: 4.5, reviewCount: 95, images: JSON.stringify([PLACEHOLDER_IMG(32)]) },
    { name: 'Studio USB Microphone', slug: 'studio-usb-microphone', description: 'Cardioid condenser USB microphone with built-in headphone monitoring. Zero-latency.', price: 119.99, compareAt: 149.99, categoryId: audio.id, inventory: 45, rating: 4.7, reviewCount: 78, images: JSON.stringify([PLACEHOLDER_IMG(33)]) },
    { name: 'DAC/Amp Combo', slug: 'dac-amp-combo', description: 'Portable USB DAC/amplifier with ESS Sabre chip. Powers headphones up to 600 ohms.', price: 99.99, categoryId: audio.id, inventory: 35, rating: 4.4, reviewCount: 41, images: JSON.stringify([PLACEHOLDER_IMG(34)]) },
    { name: 'Vinyl Record Stand', slug: 'vinyl-record-stand', description: 'Solid walnut record display stand with felt-lined slots. Holds 50 LPs.', price: 44.99, categoryId: audio.id, inventory: 25, rating: 4.2, reviewCount: 19, images: JSON.stringify([PLACEHOLDER_IMG(35)]) },
  ]

  const createdProducts = []
  for (const p of products) {
    const product = await prisma.product.create({ data: p })
    createdProducts.push(product)
  }

  const sizeVariants = ['XS', 'S', 'M', 'L', 'XL']
  const colorVariants = ['Black', 'Navy', 'Charcoal', 'Olive']
  const clothingProducts = createdProducts.filter(p => p.categoryId === clothing.id)
  for (const product of clothingProducts) {
    for (const size of sizeVariants) {
      await prisma.variant.create({
        data: { productId: product.id, type: 'size', value: size, inventory: 15 },
      })
    }
    for (const color of colorVariants) {
      await prisma.variant.create({
        data: { productId: product.id, type: 'color', value: color, inventory: 20 },
      })
    }
  }

  const storageVariants = ['256GB', '512GB', '1TB']
  const laptop = createdProducts.find(p => p.slug === 'quantum-pro-laptop')!
  for (const storage of storageVariants) {
    await prisma.variant.create({
      data: {
        productId: laptop.id,
        type: 'storage',
        value: storage,
        price: storage === '256GB' ? 1199.99 : storage === '512GB' ? 1299.99 : 1499.99,
        inventory: 15,
      },
    })
  }

  const reviewTexts = [
    { title: 'Absolutely love it', body: 'Exceeded all my expectations. Build quality is outstanding and it works flawlessly.', rating: 5 },
    { title: 'Great value', body: 'For the price point, you really cannot beat this. Highly recommend to anyone looking.', rating: 5 },
    { title: 'Solid product', body: 'Does exactly what it says. No complaints. Would buy again.', rating: 4 },
    { title: 'Pretty good overall', body: 'Minor issues with packaging but the product itself is well made and performs great.', rating: 4 },
    { title: 'Good but not perfect', body: 'Works well for most use cases. Could improve on the instructions and setup experience.', rating: 3 },
    { title: 'Decent quality', body: 'It is okay for the price. Nothing exceptional but gets the job done reliably.', rating: 3 },
    { title: 'Impressive engineering', body: 'You can tell a lot of thought went into the design. Every detail feels intentional.', rating: 5 },
    { title: 'Daily driver material', body: 'Been using this every single day for a month now and it still feels brand new.', rating: 5 },
  ]

  for (const product of createdProducts.slice(0, 15)) {
    const numReviews = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numReviews; i++) {
      const review = reviewTexts[Math.floor(Math.random() * reviewTexts.length)]
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customer.id,
          ...review,
        },
      })
    }
  }

  const statuses = ['delivered', 'shipped', 'processing', 'delivered', 'delivered']
  for (let i = 0; i < 5; i++) {
    const orderProducts = createdProducts.slice(i * 3, i * 3 + 3)
    const subtotal = orderProducts.reduce((s, p) => s + p.price, 0)
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const shipping = subtotal > 100 ? 0 : 9.99
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: statuses[i],
        subtotal,
        tax,
        shipping,
        total: Math.round((subtotal + tax + shipping) * 100) / 100,
        shippingName: 'Demo Customer',
        shippingEmail: 'demo@kiosk.zolentix.com',
        shippingAddr: '123 Innovation Blvd',
        shippingCity: 'San Francisco',
        shippingZip: '94105',
        createdAt: new Date(Date.now() - (5 - i) * 86400000 * 3),
        items: {
          create: orderProducts.map(p => ({
            productId: p.id,
            quantity: 1,
            price: p.price,
          })),
        },
      },
    })
  }

  console.log('Seed complete: 2 users, 5 categories, 30 products, reviews, 5 orders')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
