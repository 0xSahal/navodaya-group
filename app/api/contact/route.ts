import type { NextRequest } from 'next/server'
import { sendContactEmails } from '@/lib/email'
import { saveLead } from '@/lib/leads'
import { validateContact } from '@/lib/lead-validation'
import { handleLead } from '@/lib/lead-route'

/** Project enquiries from the contact form. */
export async function POST(request: NextRequest) {
  return handleLead({
    request,
    label: 'contact',
    validate: validateContact,
    send: sendContactEmails,
    persist: (fields, delivery) =>
      saveLead({ form: 'contact', fields, acknowledged: delivery.acknowledged }),
  })
}
