import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from './client'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Builds a CDN URL for a Sanity image.
 *
 * `fit: 'crop'` plus `auto: 'format'` means the editor's hotspot decides what
 * survives the crop, which matters here because the same asset is cut to 4:5
 * service cards, 4:3 and 3:4 project tiles and 21:10 media bands.
 */
export function urlFor(source: Image, width: number, height?: number) {
  let url = builder.image(source).auto('format').fit('crop').width(width)
  if (height) url = url.height(height)
  return url.url()
}

/** A figure as the site consumes it: a ready URL plus its alt text. */
export type SiteImage = {
  src: string
  alt: string
  caption?: string
  /** Gallery width hint set in the CMS. */
  span?: 'normal' | 'wide'
}

type SanityFigure = {
  asset?: unknown
  alt?: string
  caption?: string
  emphasis?: string
} | null | undefined

export function toSiteImage(figure: SanityFigure, width = 1600): SiteImage | null {
  if (!figure?.asset) return null
  return {
    src: urlFor(figure as Image, width),
    alt: figure.alt ?? '',
    ...(figure.caption ? { caption: figure.caption } : {}),
    span: figure.emphasis === 'wide' ? 'wide' : 'normal',
  }
}
