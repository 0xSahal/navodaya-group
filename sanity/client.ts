import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Cache tag every CMS read is filed under, so one webhook call can drop the lot.
 */
export const CONTENT_TAG = 'sanity'

/** Safety net if a webhook is ever missed. Publishing is the primary path. */
export const CONTENT_REVALIDATE = 3600

/**
 * The single entry point for reading content.
 *
 * Deliberately not `defineLive`/`sanityFetch` from next-sanity: that pins every
 * request to `revalidate: false` and only invalidates through a mounted
 * `<SanityLive />`. Without that component the site silently freezes at
 * build-time content, which is exactly the failure we hit on a previous
 * project. Tag-based revalidation plus an hourly fallback has no such trap.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: CONTENT_REVALIDATE, tags: [CONTENT_TAG] },
  })
}

/**
 * Uncached read for `generateStaticParams`, which runs at build time and must
 * not be served a stale CDN response.
 */
export async function sanityFetchFresh<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return client.withConfig({ useCdn: false }).fetch<T>(query, params)
}
