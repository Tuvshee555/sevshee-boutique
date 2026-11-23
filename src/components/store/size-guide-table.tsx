import type { SizeGuide } from '@/lib/settings'
import type { SizeChartKind } from '@/lib/size-chart'

export function SizeGuideTable({ guide, kind }: { guide: SizeGuide; kind: SizeChartKind }) {
  const table = guide[kind]
  if (!table || table.rows.length === 0) return null
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-stone-300">
            <th scope="col" className="py-2 pr-3 font-medium">
              Размер
            </th>
            {table.columns.map((c) => (
              <th key={c} scope="col" className="py-2 pr-3 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.size} className="border-b border-stone-200">
              <th scope="row" className="py-2 pr-3 font-medium">
                {row.size}
              </th>
              {table.columns.map((c) => (
                <td key={c} className="tabular py-2 pr-3 text-charcoal">
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
