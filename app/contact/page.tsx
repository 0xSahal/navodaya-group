import { ContactPage } from '@/components/contact/ContactPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { contactPageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

const description = `Start a project with ${siteConfig.name} in New Delhi. Call, WhatsApp, or send a brief - we reply within two working days.`

export const metadata = buildPageMetadata({
  title: 'Contact',
  description,
  path: '/contact',
})

export default function ContactRoutePage() {
  return (
    <>
      <JsonLd data={contactPageSchema(description)} />
      <ContactPage />
    </>
  )
}
