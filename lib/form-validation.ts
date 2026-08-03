/**
 * Shared input sanitizers and field validators for enquiry / vendor forms.
 * Sanitize as the user types; validate on blur, change (once touched), and submit.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PERSON_NAME_RE = /^[a-zA-Z][a-zA-Z\s.'.-]*$/
const CITY_RE = /^[a-zA-Z][a-zA-Z\s.'.-]*$/
const COMPANY_NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9\s.&',()-]*$/

/** Digits only; default max follows E.164 (15). */
export function digitsOnly(value: string, max = 15): string {
  return value.replace(/\D/g, '').slice(0, max)
}

/** Person names: letters, spaces, apostrophes, hyphens, periods. */
export function personNameOnly(value: string, max = 80): string {
  return value.replace(/[^a-zA-Z\s.'.-]/g, '').replace(/\s+/g, ' ').slice(0, max)
}

/** City / area labels: letters and light punctuation only. */
export function cityNameOnly(value: string, max = 80): string {
  return value.replace(/[^a-zA-Z\s.'.-]/g, '').replace(/\s+/g, ' ').slice(0, max)
}

/** Vendor / company names: letters, digits, and common business punctuation. */
export function companyNameOnly(value: string, max = 100): string {
  return value.replace(/[^a-zA-Z0-9\s.&',()-]/g, '').replace(/\s+/g, ' ').slice(0, max)
}

/** Strip whitespace from email as it is typed. */
export function emailOnly(value: string, max = 120): string {
  return value.replace(/\s/g, '').slice(0, max)
}

/** Free text with a hard cap (messages / scope). */
export function textOnly(value: string, max = 2000): string {
  return value.slice(0, max)
}

export function validatePersonName(value: string, required = true): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return required ? 'Please enter your name.' : undefined
  if (trimmed.length < 2) return 'Name must be at least 2 characters.'
  if (!PERSON_NAME_RE.test(trimmed)) return 'Use letters only in your name.'
  return undefined
}

export function validateCompanyName(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please enter a name.'
  if (trimmed.length < 2) return 'Name must be at least 2 characters.'
  if (!COMPANY_NAME_RE.test(trimmed)) {
    return 'Use letters, numbers, and common punctuation only.'
  }
  return undefined
}

export function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 'Please enter a phone number.'
  if (digits.length < 7) return 'Enter a valid phone number (at least 7 digits).'
  if (digits.length > 15) return 'Phone number cannot exceed 15 digits.'
  return undefined
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please enter your email.'
  if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address.'
  return undefined
}

export function validateCity(value: string, required = true): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return required ? 'Please enter a city.' : undefined
  if (trimmed.length < 2) return 'City name looks too short.'
  if (!CITY_RE.test(trimmed)) return 'Use letters only in the city name.'
  return undefined
}

export function validateRequiredSelect(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message
}

export function validateMessage(value: string, min = 20): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Tell us a little about the project.'
  if (trimmed.length < min) return `Please add a bit more detail (${min}+ characters).`
  return undefined
}

export function validateScope(value: string, min = 20): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Describe your scope of work.'
  if (trimmed.length < min) return `Please add a bit more detail (${min}+ characters).`
  return undefined
}
