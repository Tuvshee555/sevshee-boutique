// The shop's own catalogue (the engine's tests use the MANAN reference one):
// every product is complete, every photo is in the image manifest, and the
// sample orders only point at variants that exist.
import { describe, expect, it } from 'vitest'
import manifest from '../../scripts/images/manifest.json'
import { CATEGORIES, COLLECTIONS, PRODUCTS, SAMPLE_ORDERS } from '@/server/seed/alkham/catalog'
import { DEFAULT_SIZE_GUIDE } from '@/server/seed/alkham/content'
import { SAMPLES } from '@/server/seed/alkham/assistant-samples'
import { footSizes, sizeChartKind, sizeForFoot } from '@/lib/size-chart'
import { STORE_VOICE, sizeQuestion } from '@/lib/store-voice'

const catalogPhotos = new Set(manifest.filter((e) => e.kind === 'catalog').map((e) => e.key))
const editorialPhotos = new Set(manifest.filter((e) => e.kind === 'editorial').map((e) => e.key))

describe('ALKHAM catalogue', () => {
  it('has unique slugs and codes, known categories and collections', () => {
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length)
    expect(new Set(PRODUCTS.map((p) => p.code)).size).toBe(PRODUCTS.length)
    const categories = new Set(CATEGORIES.map((c) => c.slug))
    const collections = new Set(COLLECTIONS.map((c) => c.slug))
    for (const p of PRODUCTS) {
      expect(categories.has(p.category), p.slug).toBe(true)
      for (const c of p.collections ?? []) expect(collections.has(c), `${p.slug} → ${c}`).toBe(true)
    }
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
  })

  it('has a size chart row for every shoe size it sells', () => {
    for (const p of PRODUCTS) {
      const chart = DEFAULT_SIZE_GUIDE[sizeChartKind(p.category)]
      const sizes = new Set(chart?.rows.map((r) => r.size))
      for (const size of p.sizes) expect(sizes.has(size), `${p.slug} ${size}`).toBe(true)
    }
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

  it('finds the size for a foot length from the size chart (between two sizes → the larger)', () => {
    const feet = footSizes(DEFAULT_SIZE_GUIDE)
    expect(sizeForFoot(feet, 26.2)?.size).toBe('41')
    expect(sizeForFoot(feet, 23.25)?.size).toBe('37')
    expect(sizeForFoot(feet, 9.2)).toMatchObject({ size: '16', kids: true })
    expect(sizeForFoot(feet, 13.5)).toBeNull() // 21–25: not sold
    expect(sizeForFoot(feet, 31)).toBeNull()
    expect(sizeForFoot(feet, Number.NaN)).toBeNull()
  })

  it('suggests a size question in a size the product is sold in', () => {
    for (const p of PRODUCTS) {
      const q = sizeQuestion(p.sizes)
      expect(q && p.sizes.includes(q.split(' ')[0]), `${p.slug}: ${q}`).toBe(true)
    }
    expect(STORE_VOICE.starters.length).toBeGreaterThan(3)
  })
})
