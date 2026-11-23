// The seed catalogue. The shop's own is ALKHAM's (./alkham); the engine's tests
// run against the fixed MANAN reference catalogue instead (STORE_CATALOG=reference,
// set in vitest.config.mts), so they keep testing the same behaviour whatever the
// shop sells. Only the seed and the demo maintenance job read this module.
import * as alkham from './alkham/catalog'
import * as reference from './reference/catalog'

export type { SampleOrder, SeedColor, SeedProduct } from './catalog-types'

const data = process.env.STORE_CATALOG === 'reference' ? reference : alkham

export const CATEGORIES = data.CATEGORIES
export const COLLECTIONS = data.COLLECTIONS
export const PRODUCTS = data.PRODUCTS
export const SAMPLE_CUSTOMERS = data.SAMPLE_CUSTOMERS
export const SAMPLE_ORDERS = data.SAMPLE_ORDERS
