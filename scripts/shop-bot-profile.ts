// Prints this store's catalogue as a standard shop bot profile for the Ursgal Digital hub
// (ursgaldigital.com/holboh/admin, format in ursgal-digital-clean/docs/SHOP_BOT.md). The store's
// demo Facebook Page is answered from that profile, so run this and paste the output there
// whenever the seed catalogue, prices or stock change:
//   DATABASE_URL=postgres://x@127.0.0.1:1/x npx tsx scripts/shop-bot-profile.ts > profile.txt
// (the URL is never used; the seed modules only need it to be set).
import { CATEGORIES, PRODUCTS } from '@/server/seed/sevshee/catalog'
import { DEFAULT_POLICIES, DEFAULT_SHIPPING_METHODS, DEFAULT_STORE_INFO } from '@/server/seed/sevshee/content'
import { SAMPLE_FAQS } from '@/server/seed/sevshee/assistant-samples'

const SITE = 'https://sevshee-boutique.vercel.app'
const ABOUT = 'Ursgal Digital-ын демо: зохиомол эмэгтэй хувцасны бутик (даашинз, сүлжмэл, гадуур хувцас, цүнх). Бодит худалдаа хийхгүй.'
const PAYMENT = 'QPay эсвэл хүргэлтээр ирэхэд бэлнээр. Демо тул бодит төлбөр авахгүй.'
const RETURNS_EXTRA = ''

const money = (n: number) => new Intl.NumberFormat('en-US').format(n)
const firstParagraph = (body: string) => body.split(/\n\n+/)[0].trim()
const clean = (text: string) => text.replace(/\|/g, '/').replace(/\s*\n+\s*/g, ' ')

const shipping = DEFAULT_SHIPPING_METHODS.map(
  (s) => `${s.name}: ${s.fee === 0 ? 'үнэгүй' : `${money(s.fee)}₮`}, ${s.eta.toLowerCase()}${s.freeThreshold ? ` (${money(s.freeThreshold)}₮-өөс дээш үнэгүй)` : ''}`,
).join('; ')

const lines = [
  `Нэр: ${DEFAULT_STORE_INFO.storeName}`,
  `Тухай: ${ABOUT}`,
  `Цаг: ${DEFAULT_STORE_INFO.contactHours}`,
  'Хаяг: Онлайн дэлгүүр, биет салбаргүй (демо).',
  `Хүргэлт: ${shipping}. Демо тул бодит хүргэлт хийгдэхгүй.`,
  `Төлбөр: ${PAYMENT}`,
  `Буцаалт: ${firstParagraph(DEFAULT_POLICIES.returns.body)}${RETURNS_EXTRA}`,
  '',
  'Бараа:',
]
const categoryName = new Map(CATEGORIES.map((c) => [c.slug, c.name]))
for (const p of PRODUCTS) {
  const priceOf = (size: string) => p.priceOverrides?.[size] ?? p.basePrice
  // A product whose versions cost differently becomes one line per price ("… 1TB"), so every
  // line quotes an exact price and the stock of exactly those versions.
  const prices = [...new Set(p.sizes.map(priceOf))].sort((a, b) => a - b)
  for (const price of prices) {
    const sizes = p.sizes.filter((s) => priceOf(s) === price)
    const variants = p.colors.map((c) => {
      const counts = sizes.map((s) => [s, p.stock[c.code][p.sizes.indexOf(s)]] as const)
      if (counts.length === 1 && counts[0][0] === 'ONE SIZE') return `${c.name}: ${counts[0][1]}`
      return `${c.name}: ${counts.map(([s, n]) => `${s} ${n}`).join(', ')}`
    })
    const name = prices.length > 1 ? `${p.name} ${sizes.join('/')}` : p.name
    lines.push([clean(name), String(price), variants.join('; '), `${SITE}/products/${p.slug}`, categoryName.get(p.category) ?? ''].join(' | '))
  }
}
lines.push('', 'Асуулт:')
for (const f of SAMPLE_FAQS) lines.push(`${clean(f.question)} | ${clean(f.answer)}`)
lines.push(
  `Энэ жинхэнэ дэлгүүр үү? | Үгүй. ${DEFAULT_STORE_INFO.storeName} бол Ursgal Digital-ын бүтээсэн зохиомол дэлгүүр: бараа, үнэ нь жишээ, бодит худалдаа, төлбөр, хүргэлт хийгдэхгүй. Сайт: ${SITE}`,
  'Чатбот | Ийм чатботыг танай бизнест Ursgal Digital хийнэ: facebook.com/ursgaldigital.mn. Өөрийн бараагаар туршиж үзэх: ursgaldigital.com/turshih',
)
console.log(lines.join('\n'))
