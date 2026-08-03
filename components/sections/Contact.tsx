import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/contact/ContactForm'
import { siteConfig } from '@/lib/site-config'
import { unsplash } from '@/lib/images'

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Navodaya, I'd like to talk about a project.",
)

/** Distinct from the Why-band image. */
const CONTACT_IMAGE = {
  src: unsplash('photo-1497366811353-6870744d04b2', 1200),
  alt: 'Bright office interior with desks and soft daylight',
}

/**
 * Homepage contact band - primary conversion form on this page.
 */
export function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-sand/35 py-section">
      <Container>
        <SectionHead
          index="06"
          title="Start your project"
          standfirst="Tell us where the site is and what you have in mind. We will come back within two working days with next steps, and an honest view on budget."
        />

        <div className="mt-16 grid gap-x-16 gap-y-16 md:grid-cols-12 md:mt-20">
          <div className="md:col-span-4">
            <Reveal>
              <div className="relative mb-10 aspect-4/5 overflow-hidden bg-sand md:mb-12">
                <Image
                  src={CONTACT_IMAGE.src}
                  alt={CONTACT_IMAGE.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <dl className="space-y-8">
                <div>
                  <dt className="text-eyebrow uppercase text-stone">Studio</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-ink">
                    {siteConfig.contact.locationLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-eyebrow uppercase text-stone">Phone</dt>
                  <dd className="mt-3">
                    <a
                      href={`tel:${siteConfig.contact.phoneHref}`}
                      className="text-base tabular-nums text-ink transition-colors duration-300 hover:text-clay"
                    >
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-eyebrow uppercase text-stone">Email</dt>
                  <dd className="mt-3">
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-base text-ink transition-colors duration-300 hover:text-clay"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-3 border border-ink px-6 py-4 text-sm text-ink transition-colors duration-500 ease-premium hover:bg-ink hover:text-bone"
              >
                Message on WhatsApp
              </a>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.08}>
              <ContactForm variant="compact" idPrefix="home-" />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
