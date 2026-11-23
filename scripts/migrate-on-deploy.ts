// Runs before `next build`. On a Vercel production build it applies pending SQL
// migrations from ./drizzle and the idempotent seed (adds missing settings and the
// assistant's defaults; never overwrites, no owner account; sample orders only into a
// brand-new store), so
// new tables and defaults exist before the new code goes live. A failure fails the
// build and the previous deployment keeps serving. Everywhere else (local builds,
// previews without a database) it does nothing.
import * as t from '../src/server/db/schema'
import { seed } from '../src/server/seed'
import { runMigrations, withDb } from './lib/tasks'

async function main() {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('[db] Not a production deploy — migrations skipped.')
    return
  }
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set for the production build')
  await runMigrations(url)
  console.log('[db] Migrations applied.')
  // A brand-new store (no products yet) gets the whole demo, sample orders included, so the
  // admin and the bestsellers have data from the first day; later deploys only add what is missing.
  const fresh = await withDb(url, async (db) => (await db.select({ id: t.products.id }).from(t.products).limit(1)).length === 0)
  const log = await withDb(url, (db) => seed(db, { owner: null, sampleOrders: fresh }))
  for (const line of log) console.log(`[seed] ${line}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
