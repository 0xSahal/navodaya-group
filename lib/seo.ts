import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

const DESCRIPTION_MAX = 155

export function absoluteUrl(path = '/'): string {
  const base = siteConfig.url.replace(/\/$/, '')
  if (!path || path === '/') return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function truncateDescription(text: string, max = DESCRIPTION_MAX): string {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned
  const sliced = cleaned.slice(0, max - 1)
  const lastSpace = sliced.lastIndexOf(' ')
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`
}

type OgType = 'website' | 'article'

type BuildPageMetadataInput = {
  title: string
  description: string
  path: string
  /** Absolute or site-relative image URLs. Omit to use the default OG image. */
  images?: Array<string | { url: string; alt?: string; width?: number; height?: number }>
  type?: OgType
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  /** Skip the root `%s | brand` template (homepage full title). */
  absoluteTitle?: boolean
}

/**
 * Shared Metadata for every indexable page: canonical, Open Graph and Twitter
 * stay in lockstep so hubs and detail routes cannot drift.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  images,
  type = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
  absoluteTitle = false,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const desc = truncateDescription(description)
  const ogTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`
  // Always set images explicitly. Defining openGraph without images overrides
  // the file-based opengraph-image.tsx convention and leaves hubs with none.
  const ogImages = (
    images?.length
      ? images
      : [
          {
            url: absoluteUrl('/opengraph-image'),
            alt: `${siteConfig.legalName} - ${siteConfig.tagline}`,
            width: 1200,
            height: 630,
          },
        ]
  ).map((image) =>
    typeof image === 'string'
      ? { url: image }
      : {
          url: image.url,
          ...(image.alt ? { alt: image.alt } : {}),
          ...(image.width ? { width: image.width } : {}),
          ...(image.height ? { height: image.height } : {}),
        },
  )

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: 'en_IN',
      url,
      siteName: siteConfig.name,
      title: ogTitle,
      description: desc,
      images: ogImages,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: desc,
      images: ogImages.map((image) => image.url),
    },
    ...(noIndex
      ? { robots: { index: false, follow: true } }
      : { robots: { index: true, follow: true } }),
  }
}
