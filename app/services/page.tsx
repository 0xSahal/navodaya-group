import { ServicesHub } from '@/components/services/ServicesHub'
import { JsonLd } from '@/components/seo/JsonLd'
import { collectionPageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

const description = `Interior and architecture design, contracting and project management from ${siteConfig.name} in New Delhi. Three practices, one contract - from brief to handover.`

export const metadata = buildPageMetadata({
  title: 'Services',
  description,
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          path: '/services',
          name: 'Services',
          description,
          crumb: 'Services',
        })}
      />
      <ServicesHub />
    </>
  )
}
