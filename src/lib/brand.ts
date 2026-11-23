// The fictional brand's identity in one place. Rename the label here and the
// storefront, metadata, e-mails and admin follow. Store details that owners edit
// day to day (announcement, contact text, policies) live in the database
// `settings` table instead and are managed from /admin/settings.

export const BRAND = {
  /** Wordmark. Latin so it works as a domain and social handle. */
  name: 'ALKHAM',
  /** How the name is written in Mongolian Cyrillic (алхам — "a step"). */
  nameMn: 'Алхам',
  tagline: 'Алхам бүрт тохирно.',
  /** One-line positioning used in metadata. */
  description:
    'ALKHAM — Улаанбаатарын гудамж, өвөлд зориулсан пүүз, ботинк, туфлийн зохиомол гутлын дэлгүүр. Ursgal Digital-ын портфолио демо.',
  /** `.example` is a reserved domain (RFC 2606), so this can never reach a real inbox. */
  email: 'hello@alkham.example',
  /** The demo brand has no social Pages of its own. */
  facebook: null as string | null,
  instagram: null as string | null,
  /** Where the "back to portfolio" link points. */
  portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://www.ursgaldigital.com/portfolio/shoes',
  agencyName: 'Ursgal Digital',
} as const

/** Shown wherever a visitor could mistake the demo for a real shop. */
export const DEMO_NOTICE =
  'Энэ бол Ursgal Digital-ын портфолио демо. Брэнд, бүтээгдэхүүн, үнэ, үлдэгдэл бүгд зохиомол бөгөөд бодит худалдан авалт, төлбөр хийгдэхгүй.'
