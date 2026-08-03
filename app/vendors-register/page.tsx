import { VendorRegistrationPage } from '@/components/vendors/VendorRegistrationPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { simplePageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

const description = `Register as a vendor with ${siteConfig.name}. Sub-contractors, raw material suppliers and specialists welcome.`

export const metadata = buildPageMetadata({
  title: 'Vendor registration',
  description,
  path: '/vendors-register',
})

export default function VendorRegisterRoute() {
  return (
    <>
      <JsonLd
        data={simplePageSchema({
          path: '/vendors-register',
          name: 'Vendor registration',
          description,
          crumb: 'Vendor registration',
        })}
      />
      <VendorRegistrationPage />
    </>
  )
}
