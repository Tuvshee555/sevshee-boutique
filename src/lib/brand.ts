// The fictional brand's identity in one place. Rename the label here and the
// storefront, metadata, e-mails and admin follow. Store details that owners edit
// day to day (announcement, contact text, policies) live in the database
// `settings` table instead and are managed from /admin/settings.

export const BRAND = {
  /** Wordmark. Latin so it works as a domain and social handle. */
  name: 'SEVSHEE',
  /** How the name is written in Mongolian Cyrillic (сэвшээ — "a light breeze"). */
  nameMn: 'Сэвшээ',
  tagline: 'Сэвшээ салхи шиг хөнгөн.',
  /** One-line positioning used in metadata. */
  description:
    'SEVSHEE — Улаанбаатарын эмэгтэйчүүдэд зориулсан даашинз, сүлжмэл, гадуур хувцас, цүнхний зохиомол бутик. Ursgal Digital-ын портфолио демо.',
  /** `.example` is a reserved domain (RFC 2606), so this can never reach a real inbox. */
  email: 'hello@sevshee.example',
  /** The demo brand's Facebook Page (an Ursgal Digital demo Page; its Messenger is answered by the shop bot). */
  facebook: 'https://www.facebook.com/profile.php?id=61596720067864' as string | null,
  instagram: null as string | null,
  /** Messenger chat with the demo Page — its shop bot answers. */
  messenger: 'https://m.me/61596720067864',
  /** Ursgal Digital's business line: the real people behind this example shop. */
  agencyPhone: '66913149',
  /** Where the "back to portfolio" link points. */
  portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://www.ursgaldigital.com/portfolio/boutique',
  agencyName: 'Ursgal Digital',
} as const

/** Shown wherever a visitor could mistake the demo for a real shop. */
export const DEMO_NOTICE =
  'Энэ бол Ursgal Digital-ын портфолио демо. Брэнд, бүтээгдэхүүн, үнэ, үлдэгдэл бүгд зохиомол бөгөөд бодит худалдан авалт, төлбөр хийгдэхгүй.'
