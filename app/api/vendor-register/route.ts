import type { NextRequest } from 'next/server'
import { sendVendorEmails } from '@/lib/email'
import { saveLead } from '@/lib/leads'
import { validateVendor } from '@/lib/lead-validation'
import { handleLead } from '@/lib/lead-route'

/** Applications from the vendor registration form. */
export async function POST(request: NextRequest) {
  return handleLead({
    request,
    label: 'vendor',
    validate: validateVendor,
    send: sendVendorEmails,
    persist: (fields, delivery) =>
      saveLead({ form: 'vendor', fields, acknowledged: delivery.acknowledged }),
  })
}
