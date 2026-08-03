import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { siteConfig } from '@/lib/site-config'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { IntroProvider } from '@/components/providers/IntroProvider'
import { Header } from '@/components/layout/Header'
import { getServices } from '@/sanity/content'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFab } from '@/components/WhatsAppFab'
import './globals.css'

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/**
 * Instrument Serif ships a single weight, which suits the register: display
 * type here is meant to be one confident cut, not a family of five.
 */
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.legalName} | Architecture, Interiors & Contracting in New Delhi`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'architects in New Delhi',
    'interior designers Delhi NCR',
    'design and build contractor Delhi',
    'turnkey contractor New Delhi',
    'commercial interior fit-out Delhi',
    'architecture and interiors New Delhi',
  ],
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.legalName} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteConfig.legalName} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.legalName} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}

export const viewport: Viewport = {
  themeColor: '#16130F',
  colorScheme: 'light',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Header is a client component (dropdowns, scroll state), so its nav data
  // is fetched here and handed down.
  const services = await getServices()

  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {/*
         * IntroProvider is the outer one: LenisProvider reads the intro state to
         * decide when smooth scroll may start.
         */}
        <IntroProvider>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[110] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bone"
            >
              Skip to content
            </a>

            <Header services={services} />

            <main id="main" className="flex-1">
              {children}
            </main>

            <Footer />
            <WhatsAppFab />
          </LenisProvider>
        </IntroProvider>
      </body>
    </html>
  )
}
