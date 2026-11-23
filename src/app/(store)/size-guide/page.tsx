import type { Metadata } from 'next'
import { FootSizeFinder } from '@/components/store/foot-size-finder'
import { SizeGuideTable } from '@/components/store/size-guide-table'
import { footSizes } from '@/lib/size-chart'
import { getStoreContent } from '@/server/queries/settings'

export const metadata: Metadata = {
  title: 'Размерын хүснэгт',
  description: 'Насанд хүрэгчдийн болон хүүхдийн гутлын EU размерыг хөлийн уртаар (см).',
  alternates: { canonical: '/size-guide' },
}

export default async function SizeGuidePage() {
  const { sizeGuide } = await getStoreContent()
  const feet = footSizes(sizeGuide)
  return (
    <div className="container-page max-w-5xl pt-10 sm:pt-14">
      <h1 className="display text-[36px] sm:text-[52px]">Размерын хүснэгт</h1>
      <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-stone-600">{sizeGuide.note}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-14">
        <div className="space-y-12">
          {sizeGuide.shoes && sizeGuide.shoes.rows.length > 0 && (
            <section>
              <h2 className="mb-4 text-[17px] font-semibold">Насанд хүрэгчид — EU размер</h2>
              <SizeGuideTable guide={sizeGuide} kind="shoes" />
            </section>
          )}
          {sizeGuide.kids && sizeGuide.kids.rows.length > 0 && (
            <section>
              <h2 className="mb-4 text-[17px] font-semibold">Хүүхэд, нярай — EU размер</h2>
              <SizeGuideTable guide={sizeGuide} kind="kids" />
            </section>
          )}
          {(['tops', 'bottoms'] as const).some((k) => sizeGuide[k].rows.length > 0) && (
            <section>
              <h2 className="mb-4 text-[17px] font-semibold">Хувцас</h2>
              <SizeGuideTable guide={sizeGuide} kind="tops" />
              <div className="mt-6">
                <SizeGuideTable guide={sizeGuide} kind="bottoms" />
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {feet.length > 0 && <FootSizeFinder sizes={feet} />}
          <section className="border border-stone-200 bg-white p-6 text-[14.5px] leading-relaxed">
            <h2 className="mb-2 font-semibold">Хэрхэн хэмжих вэ</h2>
            <p>
              Цаасан дээр өсгийгөө хананд тулган, оймстойгоо зогсоно. Хамгийн урт хурууныхаа үзүүрийг тэмдэглээд хананаас тэмдэг хүртэл хэмжинэ. Оройн
              цагаар хэмжвэл илүү зөв — хөл өдрийн турш бага зэрэг томордог. Хоёр размерын дунд байвал туслахаас асуугаарай.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
