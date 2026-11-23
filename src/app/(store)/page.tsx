import { ArrowRight, DoorOpen, MessageCircle, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FootSizeFinder } from '@/components/store/foot-size-finder'
import { ProductCard } from '@/components/store/product-card'
import { buttonClass } from '@/components/ui/button'
import { BRAND } from '@/lib/brand'
import { compareSizes } from '@/lib/catalog'
import type { CatalogProduct } from '@/lib/catalog-filter'
import { EDITORIAL } from '@/lib/editorial'
import { formatMoney } from '@/lib/money'
import { footSizes } from '@/lib/size-chart'
import { getBestsellerIds, getCatalog, getNavigation } from '@/server/queries/catalog'
import { getStoreContent } from '@/server/queries/settings'

export const metadata: Metadata = {
  title: { absolute: `${BRAND.name} — ${BRAND.tagline}` },
  description: 'Пүүз, ботинк, өсгийтэй гутал, туфли, хүүхдийн гутал. Размер, өнгө тус бүрийн үлдэгдэл бодит цагт. (Портфолио демо)',
  alternates: { canonical: '/' },
}

/** Adult sizes on the hero's size run (the kids' range has its own link). */
const ADULT_RUN = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6">
      <h2 className="display text-[28px] sm:text-[38px]">{title}</h2>
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
  const winter = catalog.filter((p) => p.collectionSlugs.includes('winter')).slice(0, 3)
  const tiles = nav.categories.map((c) => {
    const items = catalog.filter((p) => p.categorySlug === c.slug)
    return { ...c, count: items.length, image: items[0]?.images[0] ?? null }
  })
  const kidsSizes = [...new Set(catalog.filter((p) => p.categorySlug === 'kids').flatMap((p) => p.sizes))].sort(compareSizes)
  const collections = nav.collections.filter((c) => c.isFeatured && c.slug !== 'winter').slice(0, 2)
  const freeFrom = content.shipping.find((s) => s.region === 'ub' && s.freeThreshold)?.freeThreshold
  const feet = footSizes(content.sizeGuide)

  return (
    <>
      {/* Hero: the size run is the way in */}
      <section className="border-b border-stone-200">
        <div className="mx-auto grid max-w-[90rem] lg:min-h-[calc(100svh-6.25rem)] lg:grid-cols-[1.05fr_1fr]">
          <div className="relative order-1 aspect-[5/4] bg-label sm:aspect-[16/10] lg:order-2 lg:aspect-auto">
            <Image src={EDITORIAL.hero.src} alt={EDITORIAL.hero.alt} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover object-[50%_70%]" />
          </div>
          <div className="order-2 flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:order-1 lg:px-10 lg:py-16">
            <h1 className="display max-w-[12ch] animate-rise text-[40px] sm:text-[60px] xl:text-[76px]">{BRAND.tagline}</h1>
            <p className="mt-5 max-w-md animate-rise text-[16px] leading-relaxed text-charcoal [animation-delay:80ms]">
              Пүүз, ботинк, туфли, хүүхдийн гутал. Размер бүрийн үлдэгдэл бодит цагт харагдана, хүргэгч хаалган дээр хүлээж байхад өмсөж үзнэ.
            </p>
            <div className="mt-9 animate-rise [animation-delay:160ms]">
              <p className="text-[14px] font-semibold">Размераа сонго — зөвхөн таны размерт байгаа гутал харагдана</p>
              <ul className="mt-3 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap" aria-label="Размераар үзэх">
                {ADULT_RUN.map((size) => (
                  <li key={size}>
                    <Link href={`/shop?size=${size}&stock=1`} className="size-chip w-full sm:w-auto" aria-label={`${size} размертай, бэлэн байгаа гутал`}>
                      {size}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
                {kidsSizes.length > 0 && (
                  <Link href="/shop/kids" className="link-underline inline-flex items-center gap-1.5 font-medium">
                    Хүүхдийн гутал, {kidsSizes[0]}–{kidsSizes[kidsSizes.length - 1]} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
                <a href="#foot-size" className="link-underline font-medium text-stone-600">
                  Размераа мэдэхгүй байна уу?
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service strip */}
      <section className="border-b border-stone-200 bg-white">
        <div className="container-page grid gap-4 py-5 text-[14px] text-charcoal sm:grid-cols-3">
          <p className="flex items-center gap-3">
            <Truck className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            {freeFrom ? `Улаанбаатарт ${formatMoney(freeFrom)}-өөс дээш үнэгүй хүргэлт` : 'Улаанбаатар, орон нутагт хүргэлттэй'}
          </p>
          <p className="flex items-center gap-3">
            <DoorOpen className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            Хаалган дээр өмсөж үзээд, таарахгүй бол буцаана
          </p>
          <p className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            Туслах размер, үлдэгдлийг сангаас шууд шалгана
          </p>
        </div>
      </section>

      {/* Categories */}
      {tiles.length > 0 && (
        <section className="container-page pt-16 sm:pt-20">
          <SectionHeading title="Ямар гутал хайж байна?" href="/shop" linkLabel="Бүх гутал" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {tiles.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="group block bg-white">
                  <div className="relative aspect-square overflow-hidden bg-paper-2">
                    {c.image && (
                      <Image src={c.image.url} alt={c.image.alt} fill sizes="(min-width: 1024px) 15vw, (min-width: 640px) 31vw, 48vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-2 px-3 py-3">
                    <span className="font-display text-[15px] font-semibold">{c.name}</span>
                    <span className="text-[13px] text-stone-600">{c.count}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-page pt-20">
          <SectionHeading title="Шинэ ирэлт" href="/collections/new" />
          <ProductRow products={newArrivals} />
        </section>
      )}

      {/* Winter */}
      <section className="mt-24 bg-ink text-white">
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[600px]">
            <Image src={EDITORIAL.winter.src} alt={EDITORIAL.winter.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-8 p-6 sm:p-12 lg:p-14">
            <div>
              <h2 className="display text-[34px] sm:text-[48px]">Хасах 30 хэмд бэлэн</h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/75">
                Ноосон доторлогоо, ус түлхэгч арьс, мөсөн дээр гулгахгүй ул. Улаанбаатарын өвөлд зориулж сонгосон ботинкууд.
              </p>
            </div>
            {winter.length > 0 && (
              <ul className="divide-y divide-white/15 border-y border-white/15">
                {winter.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="text-[15px] group-hover:underline group-hover:underline-offset-4">{p.name}</span>
                      <span className="shrink-0 font-display text-[15px] tabular-nums">{formatMoney(p.minPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/collections/winter" className={buttonClass('light', 'lg', 'self-start')}>
              Өвлийн гутал үзэх
            </Link>
          </div>
        </div>
      </section>

      {/* Collections + kids */}
      <section className="container-page grid gap-4 pt-24 md:grid-cols-3">
        {[
          ...collections.map((c) => ({ href: `/collections/${c.slug}`, label: c.name, note: c.eyebrow, src: c.imageUrl, alt: c.name })),
          { href: '/shop/kids', label: 'Хүүхдийн гутал', note: 'Нярайнаас 35 размер хүртэл', src: EDITORIAL.kids.src as string | null, alt: EDITORIAL.kids.alt },
        ].map((tile) => (
          <Link key={tile.href} href={tile.href} className="group relative block aspect-[4/5] overflow-hidden bg-bone">
            {tile.src && (
              <Image src={tile.src} alt={tile.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/70 to-transparent p-5 pt-20 text-white sm:p-6 sm:pt-24">
              <div>
                {tile.note && <p className="text-[13px] text-white/80">{tile.note}</p>}
                <p className="display mt-1 text-[26px] sm:text-[30px]">{tile.label}</p>
              </div>
              <ArrowRight className="mb-2 h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>

      {/* Best sellers */}
      {bestsellers.length > 0 && (
        <section className="container-page pt-24">
          <SectionHeading title="Их захиалагддаг" href="/shop" />
          <ProductRow products={bestsellers} />
          <p className="mt-6 text-[13px] text-stone-600">Демо: эрэмбэ нь сангийн жишээ захиалгад тулгуурласан.</p>
        </section>
      )}

      {/* Foot size */}
      {feet.length > 0 && (
        <section id="foot-size" className="container-page scroll-mt-24 pt-24">
          <div className="grid gap-10 bg-paper-2 p-5 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
            <div>
              <h2 className="display text-[30px] sm:text-[42px]">Размераа 3 алхамд ол</h2>
              <ol className="mt-8 space-y-6">
                {[
                  'Цаасан дээр өсгийгөө хананд тулган, оймстойгоо зогсоно.',
                  'Хамгийн урт хурууныхаа үзүүрийг тэмдэглээд, хананаас тэмдэг хүртэлх зайг сантиметрээр хэмжинэ.',
                  'Хоёр хөлөө хэмжиж, томыг нь оруулна. Хоёр размерын заагт байвал томыг нь авна.',
                ].map((step, i) => (
                  <li key={step} className="grid grid-cols-[3rem_1fr] items-start gap-4">
                    <span className="size-chip pointer-events-none bg-label" aria-hidden>
                      {i + 1}
                    </span>
                    <p className="pt-2.5 text-[15.5px] leading-relaxed text-charcoal">{step}</p>
                  </li>
                ))}
              </ol>
              <Link href="/size-guide" className="link-underline mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold">
                Размерын бүтэн хүснэгт <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="self-center">
              <FootSizeFinder sizes={feet} />
            </div>
          </div>
        </section>
      )}

      {/* Store story */}
      <section className="container-page pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[5/6] bg-bone">
            <Image src={EDITORIAL.story.src} alt={EDITORIAL.story.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="max-w-lg">
            <h2 className="display text-[30px] sm:text-[44px]">Хаалган дээр өмсөж үзнэ</h2>
            <div className="prose-store mt-6 text-[15.5px] leading-relaxed text-charcoal">
              <p>Гутлыг зургаар нь сонгоход хэцүү. Тиймээс хүргэгч хаалган дээр хүлээж байхад өмсөж үзээд, таарахгүй бол тэр дор нь буцааж болно.</p>
              <p>Гэртээ өмсөөд размер нь таарахгүй байвал 14 хоногийн дотор нэг удаа үнэгүй сольж өгнө.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/help/exchange" className="link-underline inline-flex items-center gap-1.5 text-[14px] font-semibold">
                Размер солих нөхцөл <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/about" className="link-underline inline-flex items-center gap-1.5 text-[14px] font-semibold">
                Дэлгүүрийн тухай <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mt-10 border-t border-stone-200 pt-5 text-[13px] leading-relaxed text-stone-600">
              Анхааруулга: {BRAND.name} бол {BRAND.agencyName}-ын бүтээсэн зохиомол дэлгүүр. Бараа, үнэ, үлдэгдэл жишээ өгөгдөл бөгөөд зурагнууд
              лицензтэй стокийн гэрэл зураг.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
