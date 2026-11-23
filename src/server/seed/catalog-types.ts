// Shapes of a seed catalogue: the shop's own (./sevshee) and the reference one tests use (./reference).

export interface SeedColor {
  code: string
  name: string
  hex: string
  /** Image keys from scripts/images/manifest.json shown for this colour. */
  images: string[]
}

export interface SeedProduct {
  slug: string
  /** Short code used in SKUs. */
  code: string
  name: string
  category: string
  audience: 'women' | 'men' | 'unisex'
  basePrice: number
  shortDescription: string
  description: string
  material: string
  care: string
  fit: string
  tags: string[]
  isFeatured?: boolean
  isNewArrival?: boolean
  /** Days before the seed date the product was published. */
  publishedDaysAgo: number
  sizes: string[]
  colors: SeedColor[]
  /** stock[colorCode] = units per size, in `sizes` order (the stock after the sample orders). */
  stock: Record<string, number[]>
  /** Per-size price overrides (e.g. larger sizes cost more). */
  priceOverrides?: Record<string, number>
  collections?: string[]
  imageAlt: string
}

export interface SampleOrder {
  number: string
  customer: string
  hoursAgo: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment: 'qpay' | 'cash_on_delivery'
  paid: boolean
  shipping: 'ub-standard' | 'ub-express' | 'countryside'
  district: string
  address: string
  lines: { slug: string; color: string; size: string; qty: number }[]
  cancelReason?: string
}
