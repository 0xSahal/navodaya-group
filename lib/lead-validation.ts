import {
  validateCity,
  validateEmail,
  validateMessage,
  validatePersonName,
  validatePhone,
  validateRequiredSelect,
  validateScope,
} from '@/lib/form-validation'

/*
 * Server-side validation for form submissions.
 *
 * Built on the same validators the forms use in the browser, so the two cannot
 * drift. Client-side checks are a courtesy to the user; these are the ones that
 * actually protect the inbox, because anything can POST to the route.
 */

export type FieldErrors = Record<string, string>

export type Validated<T> =
  | { ok: true; data: T }
  | { ok: false; errors: FieldErrors }

/**
 * Field the browser hides and a human never fills. Bots fill everything.
 *
 * The name is deliberately meaningless. It used to be `company_website`, with a
 * matching "Company website" label, and that silently ate real enquiries:
 * Chrome autofill and every password manager treat website / company / address
 * as known profile categories and fill them regardless of `autocomplete="off"`,
 * which Chrome has ignored for profile data for years. A filled honeypot reads
 * as a bot, so those submissions were discarded with a success response and no
 * email. Keep this name outside any autofill category, and keep the opt-out
 * data attributes on the input (see the forms).
 */
export const HONEYPOT_FIELD = 'nd_ref'

/** A genuine reader needs longer than this to read the form and type a brief. */
const MIN_FILL_MS = 3000

const asString = (value: unknown, max = 4000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

/**
 * Cheap bot checks that need no third-party service.
 *
 * Returns a reason when the submission looks automated. The route treats these
 * as a silent success: telling a bot exactly which trap it hit just helps it.
 */
export function spamReason(payload: Record<string, unknown>): string | null {
  if (asString(payload[HONEYPOT_FIELD])) return 'honeypot filled'

  const elapsed = Number(payload.elapsedMs)
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return `submitted in ${elapsed}ms`
  }

  // Link-stuffed bodies are the usual shape of contact-form spam.
  const body = `${asString(payload.message)} ${asString(payload.scope)}`
  const links = body.match(/https?:\/\//g)?.length ?? 0
  if (links >= 3) return `${links} links in body`

  return null
}

export type ContactPayload = {
  name: string
  phone: string
  email: string
  location: string
  type: string
  budget: string
  preferredContact: string
  message: string
}

export function validateContact(payload: Record<string, unknown>): Validated<ContactPayload> {
  const data: ContactPayload = {
    name: asString(payload.name, 80),
    phone: asString(payload.phone, 15),
    email: asString(payload.email, 120),
    location: asString(payload.location, 80),
    type: asString(payload.type, 40),
    budget: asString(payload.budget, 40),
    preferredContact: asString(payload.preferredContact, 20),
    message: asString(payload.message, 2000),
  }

  const errors: FieldErrors = {}
  const add = (field: string, error?: string) => {
    if (error) errors[field] = error
  }

  add('name', validatePersonName(data.name))
  add('phone', validatePhone(data.phone))
  add('email', validateEmail(data.email))
  add('location', validateCity(data.location, false))
  add('type', validateRequiredSelect(data.type, 'Choose a project type'))
  add('message', validateMessage(data.message))

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data }
}

export type VendorPayload = {
  name: string
  email: string
  phone: string
  city: string
  category: string
  scope: string
}

export function validateVendor(payload: Record<string, unknown>): Validated<VendorPayload> {
  const data: VendorPayload = {
    name: asString(payload.name, 80),
    email: asString(payload.email, 120),
    phone: asString(payload.phone, 15),
    city: asString(payload.city, 80),
    category: asString(payload.category, 60),
    scope: asString(payload.scope, 2000),
  }

  const errors: FieldErrors = {}
  const add = (field: string, error?: string) => {
    if (error) errors[field] = error
  }

  add('name', validatePersonName(data.name))
  add('email', validateEmail(data.email))
  add('phone', validatePhone(data.phone))
  add('city', validateCity(data.city))
  add('category', validateRequiredSelect(data.category, 'Choose a category'))
  add('scope', validateScope(data.scope))

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data }
}
