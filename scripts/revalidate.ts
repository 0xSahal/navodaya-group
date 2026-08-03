/**
 * Manually tells the site to drop its content cache.
 *
 * This is what the Sanity webhook does automatically. Use it when the webhook
 * is not set up yet and you have just published something in production that
 * you do not want to wait up to an hour for.
 *
 *   npx tsx scripts/revalidate.ts                          # localhost
 *   npx tsx scripts/revalidate.ts https://your-site.com    # production
 *
 * Not needed in local development: `next dev` bypasses the cache, so edits in
 * the Studio show up on the next refresh.
 */
import { createHmac } from 'node:crypto'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local', quiet: true })

const target = (process.argv[2] ?? 'http://localhost:3400').replace(/\/$/, '')
const secret = process.env.SANITY_REVALIDATE_SECRET

if (!secret) {
  console.error('SANITY_REVALIDATE_SECRET is missing from .env.local')
  process.exit(1)
}

/*
 * Sanity signs webhooks as `t=<ms>,v1=<base64url hmac>` over `<t>.<body>`.
 * Reproducing that here means the endpoint needs no separate manual-trigger
 * path, so there is one way in and one thing to secure.
 */
const body = JSON.stringify({ _type: 'manual', _id: 'manual-revalidate' })
const timestamp = Date.now()
const signature = createHmac('sha256', secret)
  .update(`${timestamp}.${body}`)
  .digest('base64url')

const url = `${target}/api/revalidate`
console.log(`POST ${url}`)

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'sanity-webhook-signature': `t=${timestamp},v1=${signature}`,
  },
  body,
})

const text = await response.text()
console.log(`${response.status} ${text}`)

if (!response.ok) {
  if (response.status === 401) {
    console.error('\nSignature rejected. The secret here and the one deployed do not match.')
  }
  if (response.status === 500 && text.includes('not set')) {
    console.error('\nThe deployed environment is missing SANITY_REVALIDATE_SECRET.')
  }
  process.exit(1)
}

console.log('\nCache dropped. The next request rebuilds from Sanity.')
