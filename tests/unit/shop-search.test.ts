import { describe, expect, it } from 'vitest'
import { matchesQuery, type CatalogProduct } from '@/lib/catalog-filter'

// This shop's own search words: English and Russian loanwords, and Mongolian typed in Latin letters.
function product(name: string, categoryName: string): CatalogProduct {
  return {
    id: name,
    slug: name,
    name,
    categorySlug: 'c',
    categoryName,
    audience: 'unisex',
    shortDescription: '',
    material: '',
    fit: null,
    basePrice: 100_000,
    minPrice: 100_000,
    maxPrice: 100_000,
    isFeatured: false,
    isNewArrival: false,
    tags: [],
    sortOrder: 0,
    publishedAt: null,
    collectionSlugs: [],
    colors: [],
    sizes: [],
    images: [],
    variants: [],
  }
}

describe('shop search words', () => {
  const dress = product('Ногоон урт даашинз', 'Даашинз')
  const skirt = product('Бордо тюль банзал', 'Банзал')
  const clutch = product('Шаргал хүрэн клатч', 'Цүнх, ороолт')
  const jacket = product('Хар арьсан хүрэм', 'Гадуур хувцас')
  it('finds dresses, skirts, bags and jackets by their English or Latin-typed names', () => {
    expect(matchesQuery(dress, 'dress')).toBe(true)
    expect(matchesQuery(dress, 'daashinz')).toBe(true)
    expect(matchesQuery(skirt, 'skirt')).toBe(true)
    expect(matchesQuery(skirt, 'banzal')).toBe(true)
    expect(matchesQuery(clutch, 'clutch')).toBe(true)
    expect(matchesQuery(clutch, 'bag')).toBe(true)
    expect(matchesQuery(jacket, 'leather jacket')).toBe(true)
    expect(matchesQuery(jacket, 'hurem')).toBe(true)
  })
  it('does not mix them up', () => {
    expect(matchesQuery(skirt, 'dress')).toBe(false)
    expect(matchesQuery(dress, 'clutch')).toBe(false)
  })
})
