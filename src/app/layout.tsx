import type { Metadata, Viewport } from 'next'
import { Golos_Text, Unbounded } from 'next/font/google'
import { BRAND } from '@/lib/brand'
import { appUrl, indexingAllowed } from '@/server/app-url'
import './globals.css'

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-golos',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
  weight: ['500', '600', '700', '800'],
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
  themeColor: '#eceef0',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${golos.variable} ${unbounded.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
