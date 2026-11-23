import type { Metadata, Viewport } from 'next'
import { Manrope, Tenor_Sans } from 'next/font/google'
import { BRAND } from '@/lib/brand'
import { appUrl, indexingAllowed } from '@/server/app-url'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

const tenor = Tenor_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-tenor',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: { type: 'website', locale: 'mn_MN', siteName: BRAND.name },
  formatDetection: { telephone: false },
  // A portfolio demo is not a real shop: keep it out of search results unless explicitly enabled.
  robots: indexingAllowed() ? { index: true, follow: true } : { index: false, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#f1f2ed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${manrope.variable} ${tenor.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
