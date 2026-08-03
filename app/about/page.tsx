import { AboutPage } from '@/components/about/AboutPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { aboutPageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

const description = `${siteConfig.name} - ${siteConfig.yearsOfExperience} years of design and build under one roof in New Delhi. ${siteConfig.tagline}.`

export const metadata = buildPageMetadata({
  title: 'About',
  description,
  path: '/about',
})

export default function AboutRoutePage() {
  return (
    <>
      <JsonLd data={aboutPageSchema(description)} />
      <AboutPage />
    </>
  )
}
