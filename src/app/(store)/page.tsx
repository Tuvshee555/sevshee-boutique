import { ArrowRight, Gift, MessageCircle, Repeat2 } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BodySizeFinder } from '@/components/store/body-size-finder'
import { ProductCard } from '@/components/store/product-card'
import { buttonClass } from '@/components/ui/button'
import { BRAND } from '@/lib/brand'
import { COLOR_FAMILIES, colorFamily, type CatalogProduct, type ColorFamily } from '@/lib/catalog-filter'
import { EDITORIAL } from '@/lib/editorial'
import { formatMoney } from '@/lib/money'
import { measureRanges } from '@/lib/size-chart'
import { getBestsellerIds, getCatalog, getNavigation } from '@/server/queries/catalog'
import { getStoreContent } from '@/server/queries/settings'

export const metadata: Metadata = {
  title: { absolute: `${BRAND.name} — ${BRAND.tagline}` },
  description: 'Даашинз, сүлжмэл, гадуур хувцас, цүнх — эмэгтэйчүүдэд зориулсан бутик. Хэмжээ, өнгө тус бүрийн үлдэгдэл бодит цагт. (Портфолио демо)',
  alternates: { canonical: '/' },
  // Shared links (Messenger, Facebook) show this card; product pages use their own photo.
  openGraph: {
    type: 'website',
    locale: 'mn_MN',
    siteName: BRAND.name,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: `${BRAND.name} — ${BRAND.tagline}` }],
  },
  twitter: { card: 'summary_large_image', images: ['/og/home.jpg'] },
}

function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6">
      <h2 className="display text-[30px] sm:text-[42px]">{title}</h2>
      {href && (
        <Link href={href} className="link-underline hidden shrink-0 items-center gap-1.5 pb-1 text-[14px] font-semibold sm:inline-flex">
          {linkLabel ?? 'Бүгдийг үзэх'} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}

function ProductRow({ products }: { products: CatalogProduct[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {products.map((p) => (
        <div key={p.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
          <ProductCard product={p} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 68vw" />
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const [catalog, nav, bestIds, content] = await Promise.all([getCatalog(), getNavigation(), getBestsellerIds(8), getStoreContent()])
  const newArrivals = [...catalog]
    .filter((p) => p.isNewArrival)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, 4)
  const bestsellers = bestIds
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is CatalogProduct => !!p)
    .slice(0, 4)
  const evening = catalog.filter((p) => p.collectionSlugs.includes('evening')).slice(0, 4)
  const families = (Object.keys(COLOR_FAMILIES) as ColorFamily[])
    .map((family) => ({ family, count: catalog.filter((p) => p.colors.some((c) => colorFamily(c.hex) === family)).length }))
    .filter((f) => f.count > 0)
  const categories = nav.categories.map((c) => ({ ...c, count: catalog.filter((p) => p.categorySlug === c.slug).length })).filter((c) => c.count > 0)
  const collections = nav.collections.filter((c) => ['office', 'winter', 'weekend'].includes(c.slug))
  const freeFrom = content.shipping.find((s) => s.region === 'ub' && s.freeThreshold)?.freeThreshold
  const guide = content.sizeGuide
  const chest = measureRanges(guide.tops, 'Цээж (см)')
  const waist = measureRanges(guide.bottoms, 'Бүсэлхий (см)')
  const hip = measureRanges(guide.bottoms, 'Ташаа (см)')

  return (
    <>
      {/* Hero: colour is the way in */}
      <section className="container-page pt-4 sm:pt-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-bone sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={EDITORIAL.hero.src} alt={EDITORIAL.hero.alt} fill preload sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
          <div className="pb-4 lg:pb-0">
            <h1 className="display max-w-[13ch] animate-rise text-[44px] sm:text-[64px] xl:text-[80px]">{BRAND.tagline}</h1>
            <p className="mt-5 max-w-md animate-rise text-[16.5px] leading-relaxed text-charcoal [animation-delay:80ms]">
              Даашинз, сүлжмэл, пиджак, цүнх — улирал бүр цөөн, сайн сонгосон загвар. Хэмжээ, өнгө бүрийн үлдэгдэл бодит цагт харагдана.
            </p>
            <div className="mt-9 animate-rise [animation-delay:160ms]">
              <p className="text-[14px] font-semibold">Дуртай өнгөөрөө сонго</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-5" aria-label="Өнгөөр үзэх">
                {families.map(({ family, count }) => (
                  <li key={family}>
                    <Link href={`/shop?color=${family}&stock=1`} className="flex w-14 flex-col items-center gap-2 text-center" aria-label={`${COLOR_FAMILIES[family].label} өнгийн бараа (${count})`}>
                      <span className="swatch" style={{ background: COLOR_FAMILIES[family].hex }} />
                      <span className="text-[12.5px] leading-tight">{COLOR_FAMILIES[family].label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
              <Link href="/collections/new" className={buttonClass('primary', 'lg')}>
                Шинэ ирэлт үзэх
              </Link>
              <Link href="/shop" className={buttonClass('outline', 'lg')}>
                Бүх бараа
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page pt-14">
          <ul className="flex flex-wrap gap-2.5" aria-label="Ангилал">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  className="inline-flex items-baseline gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-[15px] transition hover:border-ink"
                >
                  {c.name}
                  <span className="text-[12.5px] text-stone-600">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-page pt-16">
          <SectionHeading title="Шинэ ирэлт" href="/collections/new" />
          <ProductRow products={newArrivals} />
        </section>
      )}

      {/* Evening */}
      <section className="container-page pt-24">
        <div className="grid overflow-hidden rounded-[32px] bg-ink text-white lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[620px]">
            <Image src={EDITORIAL.evening.src} alt={EDITORIAL.evening.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-8 p-6 sm:p-12 lg:p-14">
            <div>
              <h2 className="display text-[36px] sm:text-[52px]">Үдшийн гоёл</h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/75">
                Шинэ жил, хурим, найзуудтайгаа уулзах орой. Гялалзсан даашинз, торгомсог майк, жижиг клатч — бүгд хэмжээ бүрийн бодит үлдэгдэлтэй.
              </p>
            </div>
            {evening.length > 0 && (
              <ul className="divide-y divide-white/15 border-y border-white/15">
                {evening.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="text-[15px] group-hover:underline group-hover:underline-offset-4">{p.name}</span>
                      <span className="shrink-0 text-[15px] tabular-nums">{formatMoney(p.minPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/collections/evening" className={buttonClass('light', 'lg', 'self-start')}>
              Үдшийн гоёл үзэх
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="container-page grid gap-4 pt-24 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-bone">
              {c.imageUrl && (
                <Image src={c.imageUrl} alt={c.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/70 to-transparent p-6 pt-24 text-white">
                <div>
                  {c.eyebrow && <p className="text-[13px] text-white/80">{c.eyebrow}</p>}
                  <p className="display mt-1 text-[30px]">{c.name}</p>
                </div>
                <ArrowRight className="mb-2 h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Best sellers */}
      {bestsellers.length > 0 && (
        <section className="container-page pt-24">
          <SectionHeading title="Их захиалагддаг" href="/shop" />
          <ProductRow products={bestsellers} />
        </section>
      )}

      {/* Size finder */}
      {chest.length > 0 && (
        <section id="size" className="container-page scroll-mt-24 pt-24">
          <div className="grid items-center gap-10 rounded-[32px] bg-paper-2 p-5 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-14">
            <div>
              <h2 className="display text-[32px] sm:text-[44px]">Хэмжээгээ нэг минутад ол</h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-charcoal">
                Цээж, бүсэлхий, ташаагаа тууз метрээр хэмжээд оруулбал цамц, даашинзны болон өмд, банзалны хэмжээг тань манай хүснэгтээр шууд олно.
              </p>
              <Link href="/size-guide" className="link-underline mt-7 inline-flex items-center gap-1.5 text-[14px] font-semibold">
                Хэмжээний бүтэн хүснэгт <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <BodySizeFinder chest={chest} waist={waist} hip={hip} />
          </div>
        </section>
      )}

      {/* Service */}
      <section className="container-page pt-24">
        <ul className="grid gap-4 text-[14.5px] text-charcoal sm:grid-cols-3">
          <li className="flex items-start gap-3 rounded-2xl bg-white p-5">
            <Repeat2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
            Хэмжээ таарахгүй бол 14 хоногийн дотор нэг удаа үнэгүй солино
          </li>
          <li className="flex items-start gap-3 rounded-2xl bg-white p-5">
            <Gift className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
            {freeFrom ? `Улаанбаатарт ${formatMoney(freeFrom)}-өөс дээш үнэгүй хүргэлт, бэлгийн боодолтой` : 'Бэлгийн боодолтой хүргэлт'}
          </li>
          <li className="flex items-start gap-3 rounded-2xl bg-white p-5">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
            Туслах хэмжээ, үлдэгдлийг сангаас шууд шалгана
          </li>
        </ul>
      </section>

      {/* Story */}
      <section className="container-page pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[32px] bg-bone">
            <Image src={EDITORIAL.story.src} alt={EDITORIAL.story.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="max-w-lg">
            <h2 className="display text-[32px] sm:text-[46px]">Цөөн, гэхдээ сонгосон</h2>
            <div className="prose-store mt-6 text-[15.5px] leading-relaxed text-charcoal">
              <p>Олон мянган бараанаас хайхын оронд улирал бүр 30 орчим загвар сонгоно: хоорондоо зохицох өнгө, өдөр бүр өмсөхөд таатай даавуу.</p>
              <p>Хэмжээ бүрийн үлдэгдэл бодит цагт харагдана — «байгаа юу?» гэж асууж хүлээх шаардлагагүй.</p>
            </div>
            <Link href="/about" className="link-underline mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold">
              Бутикийн тухай <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
