import type { Metadata } from 'next'
import { BodySizeFinder } from '@/components/store/body-size-finder'
import { SizeGuideTable } from '@/components/store/size-guide-table'
import { measureRanges } from '@/lib/size-chart'
import { getStoreContent } from '@/server/queries/settings'

export const metadata: Metadata = {
  title: 'Хэмжээний хүснэгт',
  description: 'Даашинз, цамц, сүлжмэл, гадуур хувцас болон өмд, банзалны хэмжээ — цээж, бүсэлхий, ташаагаар (см).',
  alternates: { canonical: '/size-guide' },
}

export default async function SizeGuidePage() {
  const { sizeGuide } = await getStoreContent()
  const chest = measureRanges(sizeGuide.tops, 'Цээж (см)')
  const waist = measureRanges(sizeGuide.bottoms, 'Бүсэлхий (см)')
  const hip = measureRanges(sizeGuide.bottoms, 'Ташаа (см)')
  return (
    <div className="container-page max-w-5xl pt-10 sm:pt-14">
      <h1 className="display text-[38px] sm:text-[54px]">Хэмжээний хүснэгт</h1>
      <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-stone-600">{sizeGuide.note}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-14">
        <div className="space-y-12">
          <section>
            <h2 className="mb-4 text-[17px] font-semibold">Даашинз, цамц, сүлжмэл, гадуур хувцас</h2>
            <SizeGuideTable guide={sizeGuide} kind="tops" />
          </section>
          <section>
            <h2 className="mb-4 text-[17px] font-semibold">Өмд, жинс, банзал</h2>
            <SizeGuideTable guide={sizeGuide} kind="bottoms" />
          </section>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {chest.length > 0 && <BodySizeFinder chest={chest} waist={waist} hip={hip} />}
          <section className="rounded-[28px] border border-stone-200 bg-white p-6 text-[14.5px] leading-relaxed">
            <h2 className="mb-2 font-semibold">Хэрхэн хэмжих вэ</h2>
            <p>
              <strong>Цээж:</strong> суганы доогуур цээжний хамгийн өргөн хэсгээр хэвтээ хэмжинэ. <strong>Бүсэлхий:</strong> хүйснээс бага зэрэг
              дээгүүр, хамгийн нарийн хэсгээр. <strong>Ташаа:</strong> ташааны хамгийн өргөн хэсгээр. Тууз метрийг чангалалгүй, биед зөөлөн наалдуулна.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
