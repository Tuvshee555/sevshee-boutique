'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { sizeForFoot, type FootSize } from '@/lib/size-chart'

/** Foot length in, size out — with a link to the shoes in stock in that size. */
export function FootSizeFinder({ sizes }: { sizes: FootSize[] }) {
  const id = useId()
  const [value, setValue] = useState('')
  const cm = Number(value.replace(',', '.'))
  const hit = value.trim() ? sizeForFoot(sizes, cm) : null

  return (
    <div className="border-[1.5px] border-ink bg-white p-5 sm:p-7">
      <label htmlFor={id} className="block text-[14px] font-medium">
        Хөлийн урт, см
      </label>
      <div className="mt-3 flex items-stretch gap-3">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="26.4"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))}
          className="h-14 w-32 border border-stone-300 bg-paper px-4 font-display text-2xl tabular-nums outline-none focus-visible:border-ink"
          aria-describedby={`${id}-result`}
        />
        <div
          className={`grid min-w-14 place-items-center px-3 font-display text-2xl font-semibold tabular-nums ${hit ? 'bg-label text-ink' : 'bg-paper-2 text-stone-400'}`}
          aria-hidden
        >
          {hit ? hit.size : '—'}
        </div>
      </div>
      <p id={`${id}-result`} className="mt-4 min-h-[3rem] text-[14px] leading-relaxed text-charcoal" aria-live="polite">
        {!value.trim() && 'Хэмжсэн уртаа оруулахад размер тань гарна.'}
        {value.trim() && hit && (
          <>
            {hit.kids ? 'Хүүхдийн' : 'Насанд хүрэгчдийн'} <strong>{hit.size}</strong> размер — хөлийн урт {hit.min.toFixed(1)}–{hit.max.toFixed(1)} см.{' '}
            <Link href={`${hit.kids ? '/shop/kids' : '/shop'}?size=${hit.size}&stock=1`} className="underline underline-offset-4">
              {hit.size} размерт байгаа гутлыг үзэх
            </Link>
          </>
        )}
        {value.trim() && !hit && 'Энэ урттай размер манайд алга. Туслахаас асуугаарай — ойролцоо загвар санал болгоно.'}
      </p>
    </div>
  )
}
