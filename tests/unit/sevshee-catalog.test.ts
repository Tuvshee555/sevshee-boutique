// The shop's own catalogue (the engine's tests use the MANAN reference one):
// every product is complete, every photo is in the image manifest, and the
// sample orders and chats only point at products and variants that exist.
import { describe, expect, it } from 'vitest'
import manifest from '../../scripts/images/manifest.json'
import { colorFamily } from '@/lib/catalog-filter'
import { measureRanges, sizeChartKind, sizeForMeasure } from '@/lib/size-chart'
import { STORE_VOICE, sizeQuestion } from '@/lib/store-voice'
import { SAMPLES } from '@/server/seed/sevshee/assistant-samples'
import { CATEGORIES, COLLECTIONS, PRODUCTS, SAMPLE_ORDERS } from '@/server/seed/sevshee/catalog'
import { DEFAULT_SIZE_GUIDE } from '@/server/seed/sevshee/content'

const catalogPhotos = new Set(manifest.filter((e) => e.kind === 'catalog').map((e) => e.key))
const editorialPhotos = new Set(manifest.filter((e) => e.kind === 'editorial').map((e) => e.key))

describe('SEVSHEE catalogue', () => {
  it('has unique slugs and codes, known categories and collections', () => {
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length)
    expect(new Set(PRODUCTS.map((p) => p.code)).size).toBe(PRODUCTS.length)
    const categories = new Set(CATEGORIES.map((c) => c.slug))
    const collections = new Set(COLLECTIONS.map((c) => c.slug))
    for (const p of PRODUCTS) {
      expect(categories.has(p.category), p.slug).toBe(true)
      for (const c of p.collections ?? []) expect(collections.has(c), `${p.slug} → ${c}`).toBe(true)
    }
    for (const c of CATEGORIES) expect(PRODUCTS.some((p) => p.category === c.slug), `category ${c.slug} has products`).toBe(true)
  })

  it('gives every colour photos from the manifest and a stock count for every size', () => {
    for (const p of PRODUCTS) {
      for (const color of p.colors) {
        expect(color.images.length, `${p.slug}/${color.code}`).toBeGreaterThan(0)
        for (const key of color.images) expect(catalogPhotos.has(key), `${p.slug}: photo ${key}`).toBe(true)
        expect(p.stock[color.code]?.length, `${p.slug}/${color.code} stock`).toBe(p.sizes.length)
      }
    }
    for (const c of COLLECTIONS) expect(editorialPhotos.has(c.image), `collection photo ${c.image}`).toBe(true)
    for (const key of ['hero', 'evening', 'story', 'about']) expect(editorialPhotos.has(key), key).toBe(true)
  })

  it('has a size chart row for every clothing size it sells', () => {
    for (const p of PRODUCTS) {
      if (p.sizes.every((s) => s === 'ONE SIZE')) continue
      const chart = DEFAULT_SIZE_GUIDE[sizeChartKind(p.category)]
      const sizes = new Set(chart?.rows.map((r) => r.size))
      for (const size of p.sizes) expect(sizes.has(size), `${p.slug} ${size}`).toBe(true)
    }
  })

  it('sells no pink: no colour is a light, saturated red-violet', () => {
    const isPink = (hex: string) => {
      const n = parseInt(hex.slice(1), 16)
      const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255)
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const l = (max + min) / 2
      const d = max - min
      const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
      if (d === 0) return false
      let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
      h = (h * 60 + 360) % 360
      return h >= 295 && h <= 350 && s > 0.3 && l > 0.5
    }
    for (const p of PRODUCTS) for (const c of p.colors) expect(isPink(c.hex), `${p.slug}/${c.code} ${c.hex}`).toBe(false)
    expect(isPink('#e87fa8')).toBe(true)
    for (const p of PRODUCTS) for (const c of p.colors) expect(colorFamily(c.hex), `${p.slug}/${c.code}`).toBeTruthy()
  })

  it('finds a size from body measurements (between two sizes → the larger)', () => {
    const chest = measureRanges(DEFAULT_SIZE_GUIDE.tops, 'Цээж (см)')
    const waist = measureRanges(DEFAULT_SIZE_GUIDE.bottoms, 'Бүсэлхий (см)')
    expect(sizeForMeasure(chest, 90)?.size).toBe('M')
    expect(sizeForMeasure(chest, 87.5)?.size).toBe('M')
    expect(sizeForMeasure(waist, 61)?.size).toBe('XS')
    expect(sizeForMeasure(waist, 50)).toBeNull()
    expect(sizeForMeasure(chest, 130)).toBeNull()
  })

  it('sample orders and sample chats only name products and variants that exist', () => {
    const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]))
    for (const order of SAMPLE_ORDERS) {
      for (const line of order.lines) {
        const p = bySlug.get(line.slug)
        expect(p, `${order.number}: ${line.slug}`).toBeDefined()
        expect(p!.colors.some((c) => c.code === line.color), `${order.number}: ${line.slug}/${line.color}`).toBe(true)
        expect(p!.sizes.includes(line.size), `${order.number}: ${line.slug} ${line.size}`).toBe(true)
      }
    }
    for (const chat of SAMPLES) {
      for (const slug of [...chat.messages.flatMap((m) => m.products ?? []), ...(chat.handover?.products ?? [])]) {
        expect(bySlug.has(slug), `sample chat names ${slug}`).toBe(true)
      }
    }
  })

  it('suggests size questions in sizes the product is sold in', () => {
    for (const p of PRODUCTS) {
      const q = sizeQuestion(p.sizes)
      if (p.sizes.every((s) => s === 'ONE SIZE')) expect(q).toBeNull()
      else expect(q && p.sizes.includes(q.split(' ')[0]), `${p.slug}: ${q}`).toBe(true)
    }
    expect(STORE_VOICE.starters.length).toBeGreaterThan(3)
  })
})
