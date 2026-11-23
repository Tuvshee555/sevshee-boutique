// Which size chart a product is measured against: clothes by chest or waist,
// shoes and children's shoes by foot length. Category slugs of both the shoe shop
// and the clothing reference catalogue are known here.
import type { SizeGuide } from './settings'

export type SizeChartKind = 'tops' | 'bottoms' | 'shoes' | 'kids'

const SHOE_CATEGORIES = new Set(['shoes', 'sneakers', 'boots', 'heels', 'formal', 'flats'])
const BOTTOM_CATEGORIES = new Set(['trousers', 'jeans', 'skirts'])

export function sizeChartKind(categorySlug: string): SizeChartKind {
  if (categorySlug === 'kids') return 'kids'
  if (SHOE_CATEGORIES.has(categorySlug)) return 'shoes'
  return BOTTOM_CATEGORIES.has(categorySlug) ? 'bottoms' : 'tops'
}

export interface FootSize {
  size: string
  /** Foot length range of this size, in cm. */
  min: number
  max: number
  kids: boolean
}

export function range(text: string | undefined): [number, number] | null {
  const m = /(\d+(?:[.,]\d+)?)\s*[–—-]\s*(\d+(?:[.,]\d+)?)/.exec(text ?? '')
  if (!m) return null
  const [a, b] = [Number(m[1].replace(',', '.')), Number(m[2].replace(',', '.'))]
  return Number.isFinite(a) && Number.isFinite(b) && a <= b ? [a, b] : null
}

/** The adult and children's shoe rows of a size guide, by foot length (smallest first). */
export function footSizes(guide: Pick<SizeGuide, 'shoes' | 'kids'>): FootSize[] {
  const rows: FootSize[] = []
  for (const kids of [true, false]) {
    const table = kids ? guide.kids : guide.shoes
    const column = table?.columns[0]
    if (!table || !column) continue
    for (const row of table.rows) {
      const r = range(row[column])
      if (r) rows.push({ size: row.size, min: r[0], max: r[1], kids })
    }
  }
  return rows.sort((a, b) => a.min - b.min)
}

/**
 * The size for a foot length: the first size whose range reaches it, so a foot
 * between two sizes gets the larger one. Null when the store has no size that
 * long, or when the length falls in a gap the store does not sell (e.g. 21–25).
 */
export function sizeForFoot(sizes: FootSize[], cm: number): FootSize | null {
  if (!Number.isFinite(cm) || cm <= 0) return null
  const hit = sizes.find((s) => cm <= s.max)
  if (!hit) return null
  return cm >= hit.min - 0.3 ? hit : null
}

/** A size and the body measurement range it fits, in cm. */
export interface MeasureRange {
  size: string
  min: number
  max: number
}

/** The ranges of one measurement column ("Цээж (см)") of a size table, smallest first. */
export function measureRanges(table: { columns: string[]; rows: { size: string; [measure: string]: string }[] } | undefined, column: string): MeasureRange[] {
  if (!table || !table.columns.includes(column)) return []
  const out: MeasureRange[] = []
  for (const row of table.rows) {
    const r = range(row[column])
    if (r) out.push({ size: row.size, min: r[0], max: r[1] })
  }
  return out.sort((a, b) => a.min - b.min)
}

/** The size for a body measurement: between two sizes → the larger; outside the table → null. */
export function sizeForMeasure(ranges: MeasureRange[], cm: number): MeasureRange | null {
  if (!Number.isFinite(cm) || cm <= 0 || ranges.length === 0) return null
  const hit = ranges.find((r) => cm <= r.max)
  if (!hit) return null
  return cm >= hit.min - 2 ? hit : null
}
