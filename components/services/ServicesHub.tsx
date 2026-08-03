import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { getServices } from '@/sanity/content'

const HUB_HERO = '/images/services/hero.png'

/**
 * Services index: one composition that states the three practices, then lets
 * each pillar speak for itself on its own page.
 */
export async function ServicesHub() {
  const services = await getServices()
  return (
    <>
      <section data-nav-hero className="relative min-h-[72vh] overflow-hidden bg-ink">
        <Image
          src={HUB_HERO}
          alt="Modern residence with a cantilevered upper floor over a planted court"
          fill
          priority
          quality={100}
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/35 to-ink/90"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent to-70%"
          aria-hidden="true"
        />

        <Container className="relative flex min-h-[72vh] flex-col justify-end pb-16 pt-36 md:pb-20 md:pt-44">
          <Reveal>
            <p className="text-eyebrow uppercase text-bone/65">Services</p>
            <h1 className="mt-5 max-w-3xl text-display-xl text-bone">
              Three practices.
              <span className="mt-2 block">One contract.</span>
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-bone/75">
              Interior and architecture design, contracting and project management from the
              same studio - so the drawing, the finish and the site programme describe the
              same building.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <SectionHead
            index="01"
            title="Choose a practice"
            standfirst="Each page covers scope, deliverables and the kind of space we typically leave behind. Start with the one you need most - the others stay under the same roof."
          />

          <div className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-3 md:mt-24">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.1}>
                <article className="group flex h-full flex-col">
                  <Link href={`/services/${service.slug}`} className="relative block aspect-4/5 overflow-hidden bg-sand">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
                    />
                  </Link>

                  <div className="mt-7 flex items-baseline gap-4">
                    <span className="text-eyebrow uppercase text-clay">{service.index}</span>
                    <h2 className="text-display-md text-ink">
                      <Link href={`/services/${service.slug}`} className="transition-colors duration-300 hover:text-clay">
                        {service.title}
                      </Link>
                    </h2>
                  </div>

                  <p className="mt-4 text-base leading-relaxed text-ink/85">{service.line}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{service.detail}</p>

                  <ArrowLink href={`/services/${service.slug}`} className="mt-8" tone="clay">
                    View {service.title.toLowerCase()}
                  </ArrowLink>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand/35 py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Not sure which door to walk through?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                Most briefs touch more than one practice. Tell us where the site is and
                what you have in mind - we will say honestly what belongs in design, build,
                project management, or all three.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-4 md:col-start-9">
              <ArrowLink href="/contact">Start a project</ArrowLink>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
