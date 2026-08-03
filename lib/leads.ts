import 'server-only'
import type { ContactPayload, VendorPayload } from '@/lib/lead-validation'
import { getDb, mongodbConfigured } from '@/lib/mongodb'

export type LeadForm = 'contact' | 'vendor'

type LeadBase = {
  form: LeadForm
  acknowledged: boolean
  createdAt: Date
}

export type ContactLeadDocument = LeadBase & {
  form: 'contact'
  fields: ContactPayload
}

export type VendorLeadDocument = LeadBase & {
  form: 'vendor'
  fields: VendorPayload
}

const COLLECTION = 'leads'

/**
 * Persist a delivered lead. Failures are logged and swallowed by the caller:
 * the studio already got the email, so a DB blip must not turn a good send into
 * an error screen for the visitor.
 */
export async function saveLead(
  lead:
    | { form: 'contact'; fields: ContactPayload; acknowledged: boolean }
    | { form: 'vendor'; fields: VendorPayload; acknowledged: boolean },
): Promise<void> {
  if (!mongodbConfigured) {
    console.warn('[leads] MONGODB_URI is not set; submission was not stored')
    return
  }

  const db = await getDb()
  const doc: ContactLeadDocument | VendorLeadDocument = {
    ...lead,
    createdAt: new Date(),
  }

  await db.collection(COLLECTION).insertOne(doc)
}
