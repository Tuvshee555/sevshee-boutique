// Default store content written once by the seed (then owned by the database and
// edited from /admin/settings): SEVSHEE's, or the MANAN reference for the engine's
// tests (STORE_CATALOG=reference, see ./catalog-data.ts).
import type { SizeGuide } from '@/lib/settings'
import * as sevshee from './sevshee/content'
import * as reference from './reference/content'

const data = process.env.STORE_CATALOG === 'reference' ? reference : sevshee

export const DEFAULT_STORE_INFO = data.DEFAULT_STORE_INFO
export const DEFAULT_POLICIES = data.DEFAULT_POLICIES
export const DEFAULT_SIZE_GUIDE: SizeGuide = data.DEFAULT_SIZE_GUIDE
export const DEFAULT_SHIPPING_METHODS = data.DEFAULT_SHIPPING_METHODS

/** A stored size guide with the shoe charts filled in when it was saved before them. */
export function withShoeChart(guide: SizeGuide): SizeGuide {
  return {
    ...guide,
    shoes: guide.shoes ?? DEFAULT_SIZE_GUIDE.shoes,
    kids: guide.kids ?? DEFAULT_SIZE_GUIDE.kids,
  }
}
