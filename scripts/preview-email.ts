/**
 * Renders the email templates to HTML files without sending anything.
 *
 * Stubs fetch so the Resend SDK's outbound request is captured instead of made,
 * then writes each message body to disk. Use this to eyeball template changes
 * rather than mailing yourself on every tweak.
 *
 *   npx tsx scripts/preview-email.ts [outputDir]
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local', quiet: true })

/*
 * `lib/email.ts` imports `server-only`, which throws when loaded outside Next's
 * server runtime. Pre-seeding the CJS cache with an empty module satisfies the
 * import so the templates can be rendered in a plain Node process. The guard
 * still does its job in the real build.
 */
const require = createRequire(import.meta.url)
const serverOnlyPath = require.resolve('server-only')
require.cache[serverOnlyPath] = {
  id: serverOnlyPath,
  filename: serverOnlyPath,
  loaded: true,
  exports: {},
  children: [],
  paths: [],
} as unknown as NodeModule

// The module builds its Resend client at import time, so these must be set
// before it loads. Values are irrelevant: nothing leaves the process.
process.env.RESEND_API_KEY ||= 're_preview_only'
process.env.CONTACT_EMAIL ||= 'admin@example.com'
process.env.RESEND_FROM ||= 'Navodaya Design and Contract <studio@example.com>'

type Captured = { subject: string; html: string; text: string; to: string; from: string }
const captured: Captured[] = []

const realFetch = globalThis.fetch
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString()

  if (url.includes('api.resend.com')) {
    const body = JSON.parse(String(init?.body ?? '{}'))
    captured.push({
      subject: body.subject,
      html: body.html,
      text: body.text,
      to: Array.isArray(body.to) ? body.to.join(', ') : body.to,
      from: body.from,
    })
    return new Response(JSON.stringify({ id: 'preview' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  return realFetch(input as never, init)
}) as typeof fetch

const { sendContactEmails, sendVendorEmails } = await import('../lib/email')

await sendContactEmails({
  name: 'Rohan Patel',
  email: 'rohan@example.com',
  phone: '9876543210',
  location: 'Bopal, Ahmedabad',
  type: 'Residential',
  budget: '₹1.5Cr - ₹5Cr',
  preferredContact: 'WhatsApp',
  message:
    'We are planning a four bedroom house on a 3000 sq ft plot. Looking for design and build under one contract, ideally starting after the monsoon.',
})

await sendVendorEmails({
  name: 'Acme Interiors Pvt Ltd',
  email: 'vendor@example.com',
  phone: '9876500000',
  city: 'New Delhi',
  category: 'Sub Contractor - Civil',
  scope:
    'Civil finishing works including plaster, tiling and waterproofing. Twelve years operating across Delhi NCR.',
})

const outDir = path.resolve(process.argv[2] ?? 'email-preview')
mkdirSync(outDir, { recursive: true })

captured.forEach((message, index) => {
  const slug = message.subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  const file = path.join(outDir, `${index + 1}-${slug}.html`)
  writeFileSync(file, message.html)
  // The plain-text alternative matters too: some clients show it instead.
  writeFileSync(path.join(outDir, `${index + 1}-${slug}.txt`), message.text)
  console.log(`${file}`)
  console.log(`   from    ${message.from}`)
  console.log(`   to      ${message.to}`)
  console.log(`   subject ${message.subject}\n`)
})

console.log(`${captured.length} message(s) rendered. Nothing was sent.`)
