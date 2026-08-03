import 'server-only'
import { NextResponse, type NextRequest } from 'next/server'
import { emailConfigured, type DeliveryResult } from '@/lib/email'
import { spamReason, type FieldErrors, type Validated } from '@/lib/lead-validation'

/*
 * Shared plumbing for the two lead forms, so the contact route and the vendor
 * route cannot drift in how they validate, rate-limit, persist or report
 * failure.
 */

/**
 * Per-instance rate limit. Serverless means several instances, so this is a
 * speed bump rather than a guarantee: it stops one client hammering one
 * instance, not a distributed flood. Shared storage (MongoDB or Upstash) is
 * still the right long-term home for this.
 *
 * Only *delivered* submissions count. Counting rejected ones would lock out a
 * person who simply made a few validation mistakes, which is the opposite of
 * what this is for: the thing worth protecting is the inbox, and a request that
 * fails validation never reaches it.
 */
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function recentHits(key: string, now: number) {
  return (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS)
}

function isOverLimit(key: string) {
  return recentHits(key, Date.now()).length >= MAX_PER_WINDOW
}

function recordHit(key: string) {
  const now = Date.now()
  hits.set(key, [...recentHits(key, now), now])

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [existing, times] of hits) {
      if (times.every((time) => now - time > WINDOW_MS)) hits.delete(existing)
    }
  }
}

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

export async function handleLead<T>({
  request,
  label,
  validate,
  send,
  persist,
}: {
  request: NextRequest
  label: string
  validate: (payload: Record<string, unknown>) => Validated<T>
  send: (data: T) => Promise<DeliveryResult>
  /** Runs after a successful send. Must not throw into the visitor response. */
  persist?: (data: T, delivery: DeliveryResult) => Promise<void>
}) {
  if (!emailConfigured) {
    console.error(`[${label}] RESEND_API_KEY is not set; cannot deliver enquiry`)
    return NextResponse.json(
      { message: 'Email is not configured on the server.' },
      { status: 503 },
    )
  }

  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: 'Expected a JSON body.' }, { status: 400 })
  }

  const key = clientKey(request)
  if (isOverLimit(key)) {
    return NextResponse.json(
      { message: 'Too many submissions. Please try again shortly, or call us.' },
      { status: 429 },
    )
  }

  /*
   * Spam gets a 200 with no email sent. Returning an error would tell the bot
   * which check caught it.
   *
   * The cost of that opacity is that a false positive is invisible: the visitor
   * sees the thank-you screen and the enquiry goes nowhere. That happened for
   * real (an autofilled honeypot, see HONEYPOT_FIELD), and it was only found by
   * noticing zero matching records in Resend. So in development the reason comes
   * back in the response, where it is impossible to miss. Production keeps the
   * response opaque and relies on the log line.
   */
  const spam = spamReason(payload)
  if (spam) {
    console.warn(`[${label}] discarded as spam: ${spam} - NO EMAIL SENT`)
    return NextResponse.json({
      ok: true,
      ...(process.env.NODE_ENV === 'development' ? { devDiscarded: spam } : {}),
    })
  }

  const result = validate(payload)
  if (!result.ok) {
    return NextResponse.json(
      { message: 'Some fields need attention.', errors: result.errors satisfies FieldErrors },
      { status: 422 },
    )
  }

  try {
    const delivery = await send(result.data)
    recordHit(key)
    if (delivery.note) console.warn(`[${label}] ${delivery.note}`)

    if (persist) {
      try {
        await persist(result.data, delivery)
      } catch (error) {
        // Email already landed; do not turn a DB blip into a lost thank-you.
        console.error(`[${label}] failed to persist submission:`, error)
      }
    }

    return NextResponse.json({ ok: true, acknowledged: delivery.acknowledged })
  } catch (error) {
    /*
     * The studio notification failed, so this enquiry reached nobody. Say so
     * rather than showing a success screen over a lost lead.
     */
    console.error(`[${label}] delivery failed:`, error)
    return NextResponse.json(
      { message: 'We could not send your enquiry. Please call or WhatsApp us instead.' },
      { status: 502 },
    )
  }
}
