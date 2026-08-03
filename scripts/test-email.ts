/**
 * End-to-end check of the form email pipeline.
 *
 * Posts a real submission to both routes and reports what came back, then reads
 * the Resend API to confirm each message was actually accepted and to show the
 * sender and recipient it went out with.
 *
 *   npx tsx scripts/test-email.ts                        # against localhost:3400
 *   npx tsx scripts/test-email.ts https://your-site.com  # against a deployment
 *
 * Sends real email. Run it when you are ready to check the inboxes.
 */
import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local', quiet: true })

const target = (process.argv[2] ?? 'http://localhost:3400').replace(/\/$/, '')

const apiKey = process.env.RESEND_API_KEY
const contactEmail = process.env.CONTACT_EMAIL
const fromAddress = process.env.RESEND_FROM

console.log('Configuration')
console.log(`  RESEND_API_KEY  ${apiKey ? 'set' : 'MISSING'}`)
console.log(`  CONTACT_EMAIL   ${contactEmail ?? 'MISSING'}`)
console.log(`  RESEND_FROM     ${fromAddress ?? 'not set (acknowledgement will be skipped)'}`)
console.log(`  target          ${target}\n`)

if (!apiKey) {
  console.error('Add RESEND_API_KEY to .env.local first.')
  process.exit(1)
}
if (!contactEmail) {
  console.error('Add CONTACT_EMAIL to .env.local first.')
  process.exit(1)
}

/*
 * The acknowledgement goes to whatever address the form supplies, so both test
 * submissions use CONTACT_EMAIL. That way every message lands in one inbox you
 * control, rather than mailing a stranger.
 */
const stamp = new Date().toISOString().slice(11, 19)

const submissions = [
  {
    label: 'contact',
    path: '/api/contact',
    body: {
      name: 'Delivery Test',
      phone: '9876543210',
      email: contactEmail,
      location: 'New Delhi',
      type: 'Residential',
      budget: 'Prefer not to say',
      preferredContact: 'Email',
      message: `Automated delivery test at ${stamp}. Confirming the enquiry route reaches the studio inbox and sends an acknowledgement.`,
      elapsedMs: 45_000,
    },
  },
  {
    label: 'vendor',
    path: '/api/vendor-register',
    body: {
      name: 'Delivery Test Vendor',
      email: contactEmail,
      phone: '9876543210',
      city: 'New Delhi',
      category: 'sub-contractor-civil',
      scope: `Automated delivery test at ${stamp}. Confirming the vendor route reaches the studio inbox and sends an acknowledgement.`,
      elapsedMs: 45_000,
    },
  },
]

let failed = false

for (const submission of submissions) {
  process.stdout.write(`POST ${submission.path} ... `)
  try {
    const response = await fetch(`${target}${submission.path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(submission.body),
    })
    const result = (await response.json().catch(() => ({}))) as {
      ok?: boolean
      acknowledged?: boolean
      message?: string
    }

    if (!response.ok) {
      failed = true
      console.log(`${response.status} ${result.message ?? ''}`)
      continue
    }

    console.log(
      `${response.status} ok` +
        (result.acknowledged
          ? ' (studio notified + acknowledgement sent)'
          : ' (studio notified; acknowledgement skipped)'),
    )
  } catch (error) {
    failed = true
    console.log(`unreachable: ${(error as Error).message}`)
  }
}

// Resend needs a moment before a just-sent message appears in the log.
console.log('\nWaiting for Resend to register the sends...')
await new Promise((resolve) => setTimeout(resolve, 4000))

try {
  const response = await fetch('https://api.resend.com/emails?limit=10', {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!response.ok) {
    console.log(`\nCould not read the Resend log (${response.status}).`)
    console.log('Check the dashboard at resend.com/emails instead.')
  } else {
    const payload = (await response.json()) as {
      data?: { id: string; to: string[]; from: string; subject: string; last_event?: string }[]
    }
    const recent = payload.data ?? []
    console.log(`\nMost recent ${recent.length} message(s) in Resend:\n`)
    for (const email of recent) {
      console.log(`  ${(email.last_event ?? 'unknown').padEnd(10)} ${email.subject}`)
      console.log(`             from ${email.from}`)
      console.log(`             to   ${email.to?.join(', ')}\n`)
    }
  }
} catch (error) {
  console.log(`\nCould not read the Resend log: ${(error as Error).message}`)
}

console.log(
  failed
    ? 'One or more routes failed. See above.'
    : `Both routes accepted. Check ${contactEmail} for four messages: two studio notifications and two acknowledgements.`,
)
console.log(
  '\nIn the received mail, open "show original" and confirm SPF, DKIM and DMARC all say PASS.',
)
