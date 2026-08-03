import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Projects } from '@/components/sections/Projects'
import { Why } from '@/components/sections/Why'
import { Process } from '@/components/sections/Process'
import { Testimonials } from '@/components/sections/Testimonials'
import { Contact } from '@/components/sections/Contact'
import { JsonLd } from '@/components/seo/JsonLd'
import { getHeroSlides } from '@/sanity/content'
import { homePageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

export const metadata = buildPageMetadata({
  title: `${siteConfig.legalName} | Architecture, Interiors & Contracting in New Delhi`,
  description: siteConfig.description,
  path: '/',
  absoluteTitle: true,
})

/**
 * Single page, ordered as the pitch runs: show the work, name the three
 * practices, prove them, explain how it runs, then ask for the enquiry.
 *
 * The hero is a client component (drag, keyboard, autoplay), so its slides are
 * fetched here and passed down. Every other section fetches its own content.
 */
export default async function HomePage() {
  const slides = await getHeroSlides()

  return (
    <>
      <JsonLd data={homePageSchema()} />
      <Hero slides={slides} />
      <Services />
      <Projects />
      <Why />
      <Process />
      <Testimonials />
      <Contact />
    </>
  )
}
