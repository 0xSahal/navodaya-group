import 'server-only'
import { Resend } from 'resend'
import { siteConfig } from '@/lib/site-config'

/*
 * Email delivery for form submissions.
 *
 * Two messages go out per enquiry: a notification to the studio, and an
 * acknowledgement to the person who submitted.
 *
 * The acknowledgement only fires when RESEND_FROM is set to an address on a
 * domain verified in Resend. Resend's sandbox sender (onboarding@resend.dev)
 * can only deliver to the Resend account owner, so without a verified domain an
 * acknowledgement to a real enquirer would be silently rejected. Skipping it
 * loudly is better than pretending it was sent.
 */

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

/** Verified-domain sender. Absent until the domain is set up in Resend. */
const from = process.env.RESEND_FROM
/** Where studio notifications land. */
const studioInbox = process.env.CONTACT_EMAIL ?? siteConfig.contact.email

/** Sandbox sender, usable only for mail to the Resend account owner. */
const SANDBOX_FROM = 'Navodaya <onboarding@resend.dev>'

export type DeliveryResult = {
  /** The studio was notified. If false, the enquiry reached nobody. */
  notified: boolean
  /** The enquirer got an acknowledgement. */
  acknowledged: boolean
  /** Why the acknowledgement was skipped, for the server log. */
  note?: string
}

// ---------------------------------------------------------------- styling --

const INK = '#16130F'
const BONE = '#F5F2EC'
const SAND = '#E7E1D6'
const STONE = '#5A5249'
const CLAY = '#9C4F2E'
const LINE = '#DDD5C8'

/**
 * The logo, rasterised by scripts/generate-email-logo.py and hosted on Sanity's
 * CDN.
 *
 * PNG rather than the site's SVG because no mainstream email client renders
 * SVG. Served from the CDN rather than /public so the image resolves in mail
 * sent before the site is live on its own domain, and keeps resolving if the
 * deployment URL changes. It is 400px wide and displayed at 200 so it stays
 * sharp on retina screens.
 */
const LOGO_URL =
  'https://cdn.sanity.io/images/xhkjrv4q/production/da00736257df4dc622e7b7feeaf6bc1bc747a8aa-400x256.png'
const LOGO_DISPLAY_WIDTH = 168

/**
 * Email clients ignore CSS variables and most modern CSS, so this is inline,
 * table-based, and deliberately old-fashioned.
 *
 * The logo sits on its own sand band. Setting a background on that cell means
 * the mark keeps a light ground even in clients that force dark mode, where a
 * transparent PNG in clay would otherwise sit on near-black. The `alt` carries
 * the company name so the email still identifies itself when images are
 * blocked, which is the default in plenty of clients.
 */
function shell(heading: string, intro: string, rows: string, footer: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${BONE};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BONE};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${LINE};">

  <tr><td align="center" style="background:${SAND};padding:26px 32px;border-bottom:1px solid ${LINE};">
    <img src="${LOGO_URL}" width="${LOGO_DISPLAY_WIDTH}" alt="${escapeHtml(siteConfig.legalName)}"
         style="display:block;width:${LOGO_DISPLAY_WIDTH}px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
  </td></tr>

  <tr><td style="padding:30px 32px 0 32px;">
    <h1 style="margin:0;font:400 26px/1.25 Georgia,'Times New Roman',serif;color:${INK};">${heading}</h1>
    <p style="margin:14px 0 0 0;font:15px/1.6 Helvetica,Arial,sans-serif;color:${STONE};">${intro}</p>
  </td></tr>

  <tr><td style="padding:24px 32px 8px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </td></tr>

  <tr><td style="padding:8px 32px 26px 32px;">
    <p style="margin:16px 0 0 0;font:13px/1.6 Helvetica,Arial,sans-serif;color:${STONE};">${footer}</p>
  </td></tr>

  <tr><td style="background:${BONE};padding:22px 32px;border-top:1px solid ${LINE};">
    <p style="margin:0;font:600 12px/1.5 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${CLAY};">
      ${escapeHtml(siteConfig.legalName)}
    </p>
    <p style="margin:9px 0 0 0;font:12px/1.7 Helvetica,Arial,sans-serif;color:${STONE};">
      ${siteConfig.contact.addressLines.map((line) => escapeHtml(line)).join('<br>')}
    </p>
    <p style="margin:9px 0 0 0;font:12px/1.7 Helvetica,Arial,sans-serif;color:${STONE};">
      <a href="tel:${siteConfig.contact.phoneHref}" style="color:${CLAY};text-decoration:none;">${escapeHtml(siteConfig.contact.phoneDisplay)}</a>
      &nbsp;&middot;&nbsp;
      <a href="mailto:${siteConfig.contact.email}" style="color:${CLAY};text-decoration:none;">${escapeHtml(siteConfig.contact.email)}</a>
      &nbsp;&middot;&nbsp;
      <a href="${siteConfig.url}" style="color:${CLAY};text-decoration:none;">${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ''))}</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function row(label: string, value: string) {
  if (!value) return ''
  return `<tr>
    <td style="padding:9px 0;border-bottom:1px solid ${LINE};font:11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${STONE};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:9px 0;border-bottom:1px solid ${LINE};font:15px/1.5 Helvetica,Arial,sans-serif;color:${INK};">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
  </tr>`
}

const textBlock = (pairs: [string, string][]) =>
  pairs.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')

/**
 * Signature for the plain-text alternative. Some clients show text only, and
 * every message should identify the company without relying on images.
 */
const TEXT_SIGNATURE = [
  '',
  '--',
  siteConfig.legalName,
  ...siteConfig.contact.addressLines,
  `${siteConfig.contact.phoneDisplay}  |  ${siteConfig.contact.email}`,
  siteConfig.url.replace(/^https?:\/\//, ''),
  '',
].join('\n')

// ------------------------------------------------------------------ send --

async function deliver(options: {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
  sender: string
}) {
  if (!resend) throw new Error('RESEND_API_KEY is not set')

  const { error } = await resend.emails.send({
    from: options.sender,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  })

  if (error) throw new Error(`${error.name}: ${error.message}`)
}

// --------------------------------------------------------------- enquiry --

export type ContactLead = {
  name: string
  email: string
  phone: string
  location: string
  type: string
  budget: string
  preferredContact: string
  message: string
}

export async function sendContactEmails(lead: ContactLead): Promise<DeliveryResult> {
  const pairs: [string, string][] = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Site location', lead.location],
    ['Project type', lead.type],
    ['Budget', lead.budget],
    ['Prefers', lead.preferredContact],
    ['Brief', lead.message],
  ]

  // 1. Studio notification. replyTo is the enquirer, so hitting reply works.
  await deliver({
    sender: from ?? SANDBOX_FROM,
    to: studioInbox,
    replyTo: lead.email,
    subject: `New enquiry: ${lead.name} - ${lead.type || 'Project'}${
      lead.budget ? ` - ${lead.budget}` : ''
    }`,
    html: shell(
      'New project enquiry',
      `${escapeHtml(lead.name)} sent a brief through the website.`,
      pairs.map(([k, v]) => row(k, v)).join(''),
      `Reply to this email to reach ${escapeHtml(lead.name)} directly.`,
    ),
    text: `New project enquiry\n\n${textBlock(pairs)}\n${TEXT_SIGNATURE}`,
  })

  if (!from) {
    return {
      notified: true,
      acknowledged: false,
      note:
        'RESEND_FROM not set, so no acknowledgement was sent. Verify a domain in Resend to enable it.',
    }
  }

  // 2. Acknowledgement to the enquirer.
  await deliver({
    sender: from,
    to: lead.email,
    replyTo: studioInbox,
    subject: `We have your enquiry - ${siteConfig.shortName}`,
    html: shell(
      'Thank you for your enquiry',
      `We have your brief and someone from the studio will be in touch within two working days.`,
      [
        row('Project type', lead.type),
        row('Site location', lead.location),
        row('Your brief', lead.message),
      ].join(''),
      `If it is urgent, call or WhatsApp us on ${siteConfig.contact.phoneDisplay}.`,
    ),
    text:
      `Thank you for your enquiry.\n\n` +
      `We have your brief and someone from the studio will be in touch within two working days.\n\n` +
      `${textBlock([
        ['Project type', lead.type],
        ['Site location', lead.location],
        ['Your brief', lead.message],
      ])}\n\n` +
      `If it is urgent, call or WhatsApp us on ${siteConfig.contact.phoneDisplay}.\n` +
      TEXT_SIGNATURE,
  })

  return { notified: true, acknowledged: true }
}

// ---------------------------------------------------------------- vendor --

export type VendorLead = {
  name: string
  email: string
  phone: string
  city: string
  category: string
  scope: string
}

export async function sendVendorEmails(lead: VendorLead): Promise<DeliveryResult> {
  const pairs: [string, string][] = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['City', lead.city],
    ['Category', lead.category],
    ['Scope of work', lead.scope],
  ]

  await deliver({
    sender: from ?? SANDBOX_FROM,
    to: studioInbox,
    replyTo: lead.email,
    subject: `Vendor registration: ${lead.name} - ${lead.category || 'Unspecified'}`,
    html: shell(
      'New vendor registration',
      `${escapeHtml(lead.name)} applied to join the vendor network.`,
      pairs.map(([k, v]) => row(k, v)).join(''),
      `Reply to this email to reach ${escapeHtml(lead.name)} directly.`,
    ),
    text: `New vendor registration\n\n${textBlock(pairs)}\n${TEXT_SIGNATURE}`,
  })

  if (!from) {
    return {
      notified: true,
      acknowledged: false,
      note:
        'RESEND_FROM not set, so no acknowledgement was sent. Verify a domain in Resend to enable it.',
    }
  }

  await deliver({
    sender: from,
    to: lead.email,
    replyTo: studioInbox,
    subject: `We have your vendor registration - ${siteConfig.shortName}`,
    html: shell(
      'Registration received',
      'Thank you for registering. Our procurement team reviews applications and will get in touch if there is a fit.',
      [row('Category', lead.category), row('City', lead.city), row('Scope', lead.scope)].join(''),
      `Questions? Call us on ${siteConfig.contact.phoneDisplay}.`,
    ),
    text:
      `Registration received.\n\n` +
      `Thank you for registering. Our procurement team reviews applications and will get in touch if there is a fit.\n\n` +
      `${textBlock([
        ['Category', lead.category],
        ['City', lead.city],
        ['Scope', lead.scope],
      ])}\n\n` +
      TEXT_SIGNATURE,
  })

  return { notified: true, acknowledged: true }
}

/** True when email is configured at all, so routes can fail clearly. */
export const emailConfigured = Boolean(apiKey)
