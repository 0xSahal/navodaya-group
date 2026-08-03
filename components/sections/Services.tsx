import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { getServices } from '@/sanity/content'

/**
 * The three pillars, given identical treatment. Homepage keeps one line each;
 * depth lives on `/services/[slug]`.
 */
export async function Services() {
  const services = await getServices()
  if (services.length === 0) return null

  return (
    <section id="services" className="py-section">
      <Container>
        <SectionHead
          index="01"
          title="Three practices, one contract"
          standfirst="Most clients arrive holding a drawing from one firm and a quote from another. We do interior and architecture design, contracting and project management ourselves, so the drawing and the quote describe the same building."
        />

        <div className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-3 md:mt-24">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.06}>
              <article className="group flex h-full flex-col">
                <Link
                  href={`/services/${service.slug}`}
                  className="relative block aspect-4/5 overflow-hidden bg-sand"
                >
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
                  <h3 className="text-display-md text-ink">
                    <Link
                      href={`/services/${service.slug}`}
                      className="transition-colors duration-300 hover:text-clay"
                    >
                      {service.title}
                    </Link>
                  </h3>
                </div>

                <p className="mt-4 flex-1 text-base leading-relaxed text-stone">{service.line}</p>

                <ArrowLink href={`/services/${service.slug}`} className="mt-8" tone="clay">
                  View {service.title.toLowerCase()}
                </ArrowLink>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
