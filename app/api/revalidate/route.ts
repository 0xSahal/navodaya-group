import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { NextResponse, type NextRequest } from 'next/server'
import { CONTENT_TAG } from '@/sanity/client'

/**
 * Sanity webhook target. Publishing anything in the Studio drops the cache for
 * every CMS read, so the site updates within seconds rather than waiting for the
 * hourly fallback in `sanity/client.ts`.
 *
 * Set up in Sanity Manage → API → Webhooks:
 *   URL     https://<site>/api/revalidate
 *   Trigger create / update / delete
 *   Secret  the same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not set' },
      { status: 500 },
    )
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret)

    // A missing or wrong signature means this did not come from Sanity.
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    // Next 16 takes a cache-life profile as the second argument; 'max' purges
    // every cached entry carrying the tag rather than only the freshest.
    revalidateTag(CONTENT_TAG, 'max')

    return NextResponse.json({
      revalidated: true,
      tag: CONTENT_TAG,
      type: body?._type ?? 'unknown',
      now: Date.now(),
    })
  } catch (error) {
    console.error('Revalidate webhook failed:', error)
    return NextResponse.json({ message: (error as Error).message }, { status: 500 })
  }
}
