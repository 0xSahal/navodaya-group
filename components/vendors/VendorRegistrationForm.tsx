'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { siteConfig } from '@/lib/site-config'
import { HONEYPOT_FIELD } from '@/lib/lead-validation'
import { vendorCategories } from '@/data/vendors'
import {
  cityNameOnly,
  companyNameOnly,
  digitsOnly,
  emailOnly,
  textOnly,
  validateCity,
  validateCompanyName,
  validateEmail,
  validatePhone,
  validateRequiredSelect,
  validateScope,
} from '@/lib/form-validation'

type FieldName = 'name' | 'email' | 'phone' | 'city' | 'category' | 'scope'

type FormValues = Record<FieldName, string>
type FormErrors = Partial<Record<FieldName, string>>

const INITIAL: FormValues = {
  name: '',
  email: '',
  phone: '',
  city: '',
  category: '',
  scope: '',
}

/** Sanitize each field as the user types so invalid characters never stick. */
function sanitizeField(name: FieldName, value: string): string {
  switch (name) {
    case 'name':
      return companyNameOnly(value)
    case 'email':
      return emailOnly(value)
    case 'phone':
      return digitsOnly(value, 15)
    case 'city':
      return cityNameOnly(value)
    case 'scope':
      return textOnly(value)
    default:
      return value
  }
}

/** Vendor registration form with field-level validation. */
export function VendorRegistrationForm() {
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

  function patchError(name: FieldName, value: string) {
    setErrors((prev) => {
      const next = { ...prev }
      const error = validateField(name, value)
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

    const nextErrors = validateAll(values)
    setErrors(nextErrors)
    setTouched({
      name: true,
      email: true,
      phone: true,
      city: true,
      category: true,
      scope: true,
    })

    if (Object.keys(nextErrors).length > 0) {
      const first = (Object.keys(nextErrors) as FieldName[])[0]
      document.getElementById(first)?.focus()
      return
    }

    setSubmitError(null)
    setSending(true)

    try {
      const response = await fetch('/api/vendor-register', {
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
          if (first) document.getElementById(first)?.focus()
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
    // Clear the trap too: leaving it set would discard every later submission.
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
        <p className="text-eyebrow uppercase text-clay">Registration received</p>
        <p className="mt-4 font-display text-display-md text-ink">Thank you.</p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-stone">
          Your vendor registration is with the studio. If your category fits an open
          requirement, we will reach out. For urgent follow-up, call{' '}
          <span className="tabular-nums text-ink">{siteConfig.contact.phoneDisplay}</span>.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-8 cursor-pointer border border-ink px-6 py-3 text-sm text-ink transition-colors duration-300 hover:bg-ink hover:text-bone"
        >
          Register another vendor
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-line bg-bone"
      aria-labelledby="vendor-form-title"
    >
      <div className="border-b border-ink bg-ink px-6 py-5 sm:px-8">
        <p id="vendor-form-title" className="text-center text-sm font-medium tracking-wide text-bone">
          Registration form
        </p>
      </div>

      <div className="border-b border-line px-6 py-4 sm:px-8">
        <p className="text-sm text-stone">
          Fields marked <span className="text-clay">*</span> are required.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-7 sm:px-8 sm:py-10">
        <Field
          label="Name"
          htmlFor="name"
          required
          error={touched.name ? errors.name : undefined}
          errorId="name-error"
        >
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="organization"
            inputMode="text"
            maxLength={100}
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => markTouched('name')}
            placeholder="Vendor or company name"
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
            className={inputClass(Boolean(touched.name && errors.name))}
          />
        </Field>

        <Field
          label="Email"
          htmlFor="email"
          required
          error={touched.email ? errors.email : undefined}
          errorId="email-error"
        >
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => markTouched('email')}
            placeholder="you@company.com"
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
            className={inputClass(Boolean(touched.email && errors.email))}
          />
        </Field>

        <Field
          label="Phone number"
          htmlFor="phone"
          required
          error={touched.phone ? errors.phone : undefined}
          errorId="phone-error"
          hint="Digits only, 7-15 characters."
          hintId="phone-hint"
        >
          <input
            id="phone"
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
                touched.phone && errors.phone ? 'phone-error' : null,
                !(touched.phone && errors.phone) ? 'phone-hint' : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={inputClass(Boolean(touched.phone && errors.phone))}
          />
        </Field>

        <Field
          label="City name"
          htmlFor="city"
          required
          error={touched.city ? errors.city : undefined}
          errorId="city-error"
        >
          <input
            id="city"
            name="city"
            type="text"
            inputMode="text"
            autoComplete="address-level2"
            maxLength={80}
            value={values.city}
            onChange={(e) => setValue('city', e.target.value)}
            onBlur={() => markTouched('city')}
            placeholder="City of operation"
            aria-invalid={Boolean(touched.city && errors.city)}
            aria-describedby={touched.city && errors.city ? 'city-error' : undefined}
            className={inputClass(Boolean(touched.city && errors.city))}
          />
        </Field>

        <Field
          label="Vendor’s category"
          htmlFor="category"
          required
          error={touched.category ? errors.category : undefined}
          errorId="category-error"
          className="sm:col-span-2"
        >
          <div className="relative">
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={(e) => setValue('category', e.target.value)}
              onBlur={() => markTouched('category')}
              aria-invalid={Boolean(touched.category && errors.category)}
              aria-describedby={touched.category && errors.category ? 'category-error' : undefined}
              className={`${inputClass(Boolean(touched.category && errors.category))} cursor-pointer appearance-none pr-10`}
            >
              <option value="" disabled>
                Choose vendor’s category
              </option>
              {vendorCategories.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <SelectChevron />
          </div>
        </Field>

        <Field
          label="Scope of work"
          htmlFor="scope"
          required
          error={touched.scope ? errors.scope : undefined}
          errorId="scope-error"
          hint="Describe the trades, materials or services you supply (20+ characters)."
          hintId="scope-hint"
          className="sm:col-span-2"
        >
          <textarea
            id="scope"
            name="scope"
            rows={5}
            maxLength={2000}
            value={values.scope}
            onChange={(e) => setValue('scope', e.target.value)}
            onBlur={() => markTouched('scope')}
            placeholder="e.g. Civil finishing, modular interiors, steel supply…"
            aria-invalid={Boolean(touched.scope && errors.scope)}
            aria-describedby={
              [
                touched.scope && errors.scope ? 'scope-error' : null,
                !(touched.scope && errors.scope) ? 'scope-hint' : null,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={`${inputClass(Boolean(touched.scope && errors.scope))} min-h-[8rem] resize-y`}
          />
        </Field>
      </div>

      {/*
        Bot trap. Off-screen rather than display:none, because some bots skip
        hidden inputs. aria-hidden and tabIndex keep it away from real users.

        The label and name are deliberately neutral, and the data-* attributes
        opt out of every major password manager. This field was previously
        called "Company website", which Chrome autofill and password managers
        recognised and filled, so genuine submissions were discarded as bots.
        Do not give it a name or label that maps to an autofill category.
      */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Reference</label>
        <input
          id={HONEYPOT_FIELD}
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
          {sending ? 'Submitting...' : 'Submit registration'}
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
        ) : null}
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

function validateField(name: FieldName, value: string): string | undefined {
  switch (name) {
    case 'name':
      return validateCompanyName(value)
    case 'email':
      return validateEmail(value)
    case 'phone':
      return validatePhone(value)
    case 'city':
      return validateCity(value, true)
    case 'category':
      return validateRequiredSelect(value, 'Choose a vendor category.')
    case 'scope':
      return validateScope(value)
    default:
      return undefined
  }
}

function validateAll(values: FormValues): FormErrors {
  const fields: FieldName[] = ['name', 'email', 'phone', 'city', 'category', 'scope']
  const next: FormErrors = {}
  for (const field of fields) {
    const error = validateField(field, values[field])
    if (error) next[field] = error
  }
  return next
}
