'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { siteConfig } from '@/lib/site-config'
import { HONEYPOT_FIELD } from '@/lib/lead-validation'
import {
  cityNameOnly,
  digitsOnly,
  emailOnly,
  personNameOnly,
  textOnly,
  validateCity,
  validateEmail,
  validateMessage,
  validatePersonName,
  validatePhone,
  validateRequiredSelect,
} from '@/lib/form-validation'

const PROJECT_TYPES = ['Residential', 'Commercial', 'Interior only', 'Not sure yet'] as const
const CONTACT_METHODS = ['Phone', 'WhatsApp', 'Email'] as const

const BUDGET_BANDS = [
  'Under ₹50L',
  '₹50L - ₹1.5Cr',
  '₹1.5Cr - ₹5Cr',
  'Above ₹5Cr',
  'Prefer not to say',
] as const

type FieldName =
  | 'name'
  | 'phone'
  | 'email'
  | 'location'
  | 'type'
  | 'budget'
  | 'preferredContact'
  | 'message'

type FormValues = Record<FieldName, string>
type FormErrors = Partial<Record<FieldName, string>>

const INITIAL: FormValues = {
  name: '',
  phone: '',
  email: '',
  location: '',
  type: '',
  budget: '',
  preferredContact: 'Phone',
  message: '',
}

/** Sanitize each field as the user types so invalid characters never stick. */
function sanitizeField(name: FieldName, value: string): string {
  switch (name) {
    case 'name':
      return personNameOnly(value)
    case 'phone':
      return digitsOnly(value, 15)
    case 'email':
      return emailOnly(value)
    case 'location':
      return cityNameOnly(value)
    case 'message':
      return textOnly(value)
    default:
      return value
  }
}

type ContactFormProps = {
  variant?: 'compact' | 'full'
  idPrefix?: string
}

/** Enquiry form with field-level validation. */
export function ContactForm({ variant = 'compact', idPrefix = '' }: ContactFormProps) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})

  /* Bot traps: a field humans never see, and how long the form was open. */
  const [honeypot, setHoneypot] = useState('')
  const openedAt = useRef(0)
  // Stamped after mount: calling Date.now() during render is impure.
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  const full = variant === 'full'
  const id = (name: string) => `${idPrefix}${name}`

  function patchError(name: FieldName, value: string) {
    setErrors((prev) => {
      const next = { ...prev }
      const error = validateField(name, value, full)
      if (error) next[name] = error
      else delete next[name]
      return next
    })
  }

  function setValue(name: FieldName, value: string) {
    const next = sanitizeField(name, value)
    setValues((prev) => ({ ...prev, [name]: next }))
    if (touched[name] || errors[name]) patchError(name, next)
  }

  function markTouched(name: FieldName) {
    setTouched((prev) => ({ ...prev, [name]: true }))
    patchError(name, values[name])
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const nextErrors = validateAll(values, full)
    setErrors(nextErrors)
    setTouched({
      name: true,
      phone: true,
      email: true,
      location: true,
      type: true,
      budget: true,
      preferredContact: true,
      message: true,
    })

    if (Object.keys(nextErrors).length > 0) {
      const first = (Object.keys(nextErrors) as FieldName[])[0]
      document.getElementById(id(first))?.focus()
      return
    }

    setSubmitError(null)
    setSending(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: honeypot,
          elapsedMs: Date.now() - openedAt.current,
        }),
      })

      const result = (await response.json().catch(() => ({}))) as {
        message?: string
        errors?: FormErrors
      }

      if (!response.ok) {
        // The server re-runs the same validators, so surface anything it caught.
        if (result.errors) {
          setErrors(result.errors)
          const first = (Object.keys(result.errors) as FieldName[])[0]
          if (first) document.getElementById(id(first))?.focus()
        }
        setSubmitError(result.message ?? 'Something went wrong. Please try again.')
        return
      }

      setSent(true)
    } catch {
      setSubmitError(
        'We could not reach the server. Check your connection, or call us instead.',
      )
    } finally {
      setSending(false)
    }
  }

  function resetForm() {
    setSent(false)
    setSubmitError(null)
    setValues(INITIAL)
    setErrors({})
    setTouched({})
    // Clear the trap too: leaving it set would discard every later enquiry.
    setHoneypot('')
    openedAt.current = Date.now()
  }

  if (sent) {
    return (
      <div
        className="border border-line bg-bone px-6 py-10 sm:px-8"
        role="status"
        aria-live="polite"
      >
        <p className="text-eyebrow uppercase text-clay">Enquiry received</p>
        <p className="mt-4 font-display text-display-md text-ink">Thank you.</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-stone">
          Your enquiry is with the studio. Someone from our team will call you within two
          working days. If it is urgent, WhatsApp us on{' '}
          <span className="tabular-nums text-ink">{siteConfig.contact.whatsappDisplay}</span>.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-8 cursor-pointer border border-ink px-6 py-3 text-sm text-ink transition-colors duration-300 hover:bg-ink hover:text-bone"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-line bg-bone"
      aria-labelledby={id('form-title')}
    >
      <div className="border-b border-line px-6 py-5 sm:px-8">
        <p id={id('form-title')} className="text-eyebrow uppercase text-clay">
          Enquiry form
        </p>
        <p className="mt-2 text-sm text-stone">
          Fields marked <span className="text-clay">*</span> are required.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-7 sm:px-8 sm:py-10">
        <Field
          label="Your name"
          htmlFor={id('name')}
          required
          error={touched.name ? errors.name : undefined}
          errorId={id('name-error')}
        >
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            inputMode="text"
            maxLength={80}
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => markTouched('name')}
            placeholder="Full name"
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? id('name-error') : undefined}
            className={inputClass(Boolean(touched.name && errors.name))}
          />
        </Field>

        <Field
          label="Phone"
          htmlFor={id('phone')}
          required
          error={touched.phone ? errors.phone : undefined}
          errorId={id('phone-error')}
          hint="Digits only, 7-15 characters."
          hintId={id('phone-hint')}
        >
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            maxLength={15}
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setValue('phone', e.target.value)}
            onBlur={() => markTouched('phone')}
            placeholder="Phone number"
            aria-invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby={
              [
                touched.phone && errors.phone ? id('phone-error') : null,
                !(touched.phone && errors.phone) ? id('phone-hint') : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={inputClass(Boolean(touched.phone && errors.phone))}
          />
        </Field>

        <Field
          label="Email"
          htmlFor={id('email')}
          required
          error={touched.email ? errors.email : undefined}
          errorId={id('email-error')}
        >
          <input
            id={id('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => markTouched('email')}
            placeholder="you@example.com"
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? id('email-error') : undefined}
            className={inputClass(Boolean(touched.email && errors.email))}
          />
        </Field>

        <Field
          label="Site location"
          htmlFor={id('location')}
          error={touched.location ? errors.location : undefined}
          errorId={id('location-error')}
        >
          <input
            id={id('location')}
            name="location"
            type="text"
            inputMode="text"
            maxLength={80}
            value={values.location}
            onChange={(e) => setValue('location', e.target.value)}
            onBlur={() => markTouched('location')}
            placeholder="City or area"
            aria-invalid={Boolean(touched.location && errors.location)}
            aria-describedby={
              touched.location && errors.location ? id('location-error') : undefined
            }
            className={inputClass(Boolean(touched.location && errors.location))}
          />
        </Field>

        <Field
          label="Project type"
          htmlFor={id('type')}
          required
          error={touched.type ? errors.type : undefined}
          errorId={id('type-error')}
          className={full ? undefined : 'sm:col-span-2'}
        >
          <div className="relative">
            <select
              id={id('type')}
              name="type"
              value={values.type}
              onChange={(e) => setValue('type', e.target.value)}
              onBlur={() => markTouched('type')}
              aria-invalid={Boolean(touched.type && errors.type)}
              aria-describedby={touched.type && errors.type ? id('type-error') : undefined}
              className={`${inputClass(Boolean(touched.type && errors.type))} cursor-pointer appearance-none pr-10`}
            >
              <option value="" disabled>
                Select project type
              </option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </Field>

        {full ? (
          <Field label="Budget band" htmlFor={id('budget')}>
            <div className="relative">
              <select
                id={id('budget')}
                name="budget"
                value={values.budget}
                onChange={(e) => setValue('budget', e.target.value)}
                className={`${inputClass(false)} cursor-pointer appearance-none pr-10`}
              >
                <option value="">Optional - select a band</option>
                {BUDGET_BANDS.map((band) => (
                  <option key={band} value={band}>
                    {band}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </Field>
        ) : null}

        {full ? (
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium text-ink">
              Preferred contact <span className="text-clay">*</span>
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {CONTACT_METHODS.map((method) => {
                const selected = values.preferredContact === method
                return (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 text-sm transition-colors duration-300 ${
                      selected
                        ? 'border-ink bg-sand/50 text-ink'
                        : 'border-line bg-bone text-stone hover:border-ink/40 hover:text-ink'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={selected}
                      onChange={() => setValue('preferredContact', method)}
                      className="h-3.5 w-3.5 cursor-pointer accent-clay"
                    />
                    {method}
                  </label>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        <Field
          label="About the project"
          htmlFor={id('message')}
          required
          error={touched.message ? errors.message : undefined}
          errorId={id('message-error')}
          hint="At least 20 characters - plot, scope, rough timeline."
          hintId={id('message-hint')}
          className="sm:col-span-2"
        >
          <textarea
            id={id('message')}
            name="message"
            rows={full ? 6 : 5}
            maxLength={2000}
            value={values.message}
            onChange={(e) => setValue('message', e.target.value)}
            onBlur={() => markTouched('message')}
            placeholder="Plot size, what you want to build, rough timeline."
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={
              [
                touched.message && errors.message ? id('message-error') : null,
                !(touched.message && errors.message) ? id('message-hint') : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={`${inputClass(Boolean(touched.message && errors.message))} min-h-[8.5rem] resize-y`}
          />
        </Field>
      </div>

      {/*
        Bot trap. Off-screen rather than display:none, because some bots skip
        hidden inputs. aria-hidden and tabIndex keep it away from real users.

        The label and name are deliberately neutral, and the data-* attributes
        opt out of every major password manager. This field was previously
        called "Company website", which Chrome autofill and password managers
        recognised and filled, so genuine enquiries were discarded as bots.
        Do not give it a name or label that maps to an autofill category.
      */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={id(HONEYPOT_FIELD)}>Reference</label>
        <input
          id={id(HONEYPOT_FIELD)}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          data-bwignore="true"
          data-form-type="other"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="border-t border-line bg-sand/35 px-6 py-6 sm:px-8">
        {submitError ? (
          <p
            role="alert"
            className="mb-5 border-l-2 border-clay bg-clay/5 px-4 py-3 text-sm leading-relaxed text-ink"
          >
            {submitError}{' '}
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="whitespace-nowrap underline underline-offset-4 hover:text-clay"
            >
              {siteConfig.contact.phoneDisplay}
            </a>
          </p>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="group inline-flex w-full cursor-pointer items-center justify-center gap-4 bg-ink px-9 py-4 text-sm tracking-wide text-bone transition-colors duration-500 ease-premium hover:bg-clay disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink sm:w-auto"
        >
          {sending ? 'Sending...' : 'Send enquiry'}
          <svg
            width="18"
            height="8"
            viewBox="0 0 18 8"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
          >
            <path d="M0 4h16M13 1l3.2 3-3.2 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  required,
  error,
  errorId,
  hint,
  hintId,
  className = '',
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  errorId?: string
  hint?: string
  hintId?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-clay" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-stone/60">Optional</span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error ? (
        <p id={hintId} className="mt-2 text-xs text-stone/65">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 text-xs text-clay" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return [
    'w-full border bg-sand/40 px-4 py-3.5 text-base text-ink transition-colors duration-300',
    'placeholder:text-stone/45',
    'focus:border-clay focus:bg-bone focus:outline-none focus:ring-1 focus:ring-clay/30',
    hasError ? 'border-clay/70 bg-clay/5' : 'border-line hover:border-ink/30',
  ].join(' ')
}

function SelectChevron() {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone"
    >
      <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function validateField(name: FieldName, value: string, full: boolean): string | undefined {
  switch (name) {
    case 'name':
      return validatePersonName(value)
    case 'phone':
      return validatePhone(value)
    case 'email':
      return validateEmail(value)
    case 'location':
      return validateCity(value, false)
    case 'type':
      return validateRequiredSelect(value, 'Select a project type.')
    case 'budget':
      return undefined
    case 'preferredContact':
      return full ? validateRequiredSelect(value, 'Choose how we should reach you.') : undefined
    case 'message':
      return validateMessage(value)
    default:
      return undefined
  }
}

function validateAll(values: FormValues, full: boolean): FormErrors {
  const fields: FieldName[] = full
    ? ['name', 'phone', 'email', 'location', 'type', 'budget', 'preferredContact', 'message']
    : ['name', 'phone', 'email', 'location', 'type', 'message']

  const next: FormErrors = {}
  for (const field of fields) {
    const error = validateField(field, values[field], full)
    if (error) next[field] = error
  }
  return next
}
