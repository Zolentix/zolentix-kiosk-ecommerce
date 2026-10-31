export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function parseImages(images: string): string[] {
  try {
    return JSON.parse(images)
  } catch {
    return [images]
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'delivered': return 'text-kiosk-success'
    case 'shipped': return 'text-kiosk-accent'
    case 'processing': return 'text-kiosk-warning'
    case 'cancelled': return 'text-kiosk-error'
    default: return 'text-kiosk-text-muted'
  }
}
