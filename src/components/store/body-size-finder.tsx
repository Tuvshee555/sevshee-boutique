'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { sizeForMeasure, type MeasureRange } from '@/lib/size-chart'

type Field = 'chest' | 'waist' | 'hip'

const FIELDS: { key: Field; label: string; hint: string }[] = [
  { key: 'chest', label: 'Цээж', hint: '88' },
  { key: 'waist', label: 'Бүсэлхий', hint: '70' },
  { key: 'hip', label: 'Ташаа', hint: '96' },
]

/** The larger of two sizes (ranges are ordered smallest first). */
function larger(a: MeasureRange | null, b: MeasureRange | null): MeasureRange | null {
  if (!a) return b
  if (!b) return a
  return b.max > a.max ? b : a
}

/** Chest, waist and hip in; a top size and a bottom size out, each with a link to what is in stock. */
export function BodySizeFinder({ chest, waist, hip }: { chest: MeasureRange[]; waist: MeasureRange[]; hip: MeasureRange[] }) {
  const id = useId()
  const [values, setValues] = useState<Record<Field, string>>({ chest: '', waist: '', hip: '' })
  const num = (key: Field) => (values[key].trim() ? Number(values[key].replace(',', '.')) : Number.NaN)
  const top = sizeForMeasure(chest, num('chest'))
  const bottom = larger(sizeForMeasure(waist, num('waist')), sizeForMeasure(hip, num('hip')))
  const typed = FIELDS.some((f) => values[f.key].trim())

  return (
    <div className="rounded-[28px] bg-white p-5 sm:p-7">
      <div className="grid grid-cols-3 gap-3">
        {FIELDS.map((f) => (
          <label key={f.key} htmlFor={`${id}-${f.key}`} className="block">
            <span className="block text-[13.5px] font-semibold">{f.label}, см</span>
            <input
              id={`${id}-${f.key}`}
              inputMode="decimal"
              autoComplete="off"
              placeholder={f.hint}
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value.replace(/[^\d.,]/g, '').slice(0, 5) }))}
              className="mt-2 h-13 w-full rounded-full border border-stone-300 bg-paper px-4 text-center font-display text-xl tabular-nums outline-none focus-visible:border-ink"
            />
          </label>
        ))}
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3" aria-live="polite">
        {[
          { label: 'Цамц, даашинз, сүлжмэл', hit: top, href: '/shop' },
          { label: 'Өмд, банзал', hit: bottom, href: '/shop' },
        ].map((r) => (
          <div key={r.label} className={`rounded-2xl px-4 py-3 ${r.hit ? 'bg-label' : 'bg-paper-2'}`}>
            <dt className="text-[13px] text-charcoal">{r.label}</dt>
            <dd className="mt-1 font-display text-3xl">{r.hit ? r.hit.size : '—'}</dd>
            {r.hit && (
              <Link href={`${r.href}?size=${r.hit.size}&stock=1`} className="mt-1 inline-block text-[13px] underline underline-offset-4">
                {r.hit.size} хэмжээнд байгаа бараа
              </Link>
            )}
          </div>
        ))}
      </dl>
      <p className="mt-4 min-h-[1.5rem] text-[13.5px] text-stone-600">
        {!typed
          ? 'Тууз метрээр хэмжээд оруулна уу. Хоёр хэмжээний дунд байвал томыг нь санал болгоно.'
          : !top && !bottom
            ? 'Энэ хэмжээ манай хүснэгтэд алга. Туслахаас асуугаарай — загвараар нь зөвлөнө.'
            : 'Загвар бүрийн хэлбэр («Чөлөөтэй», «Биед таарсан») барааны хуудсанд бий.'}
      </p>
    </div>
  )
}
