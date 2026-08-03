import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { ContactForm } from '@/components/contact/ContactForm'
import { siteConfig } from '@/lib/site-config'
import { BLUR, unsplash } from '@/lib/images'

const HERO = unsplash('photo-1497366216548-37526070297c', 2400)
const STUDIO = unsplash('photo-1497366811353-6870744d04b2', 1600)

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Navodaya, I'd like to talk about a project.",
)

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteConfig.contact.addressLines.join(', '),
)}`

const nextSteps = [
  {
    index: '01',
    title: 'We read the brief',
    text: 'Someone from the studio opens your note within two working days - not an autoresponder.',
  },
  {
    index: '02',
    title: 'A short call',
    text: 'We clarify site, scope and budget band, and say honestly what belongs in design, build or both.',
  },
  {
    index: '03',
    title: 'Next steps in writing',
    text: 'If it is a fit, you get a clear path: site visit, fee outline, or a decline with a reason.',
  },
]

const channels = [
  {
    label: 'Phone',
    value: siteConfig.contact.phoneDisplay,
    href: `tel:${siteConfig.contact.phoneHref}`,
    hint: 'Best for a quick first conversation',
  },
  {
    label: 'Email',
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    hint: 'Send drawings or a written brief',
  },
  {
    label: 'WhatsApp',
    value: siteConfig.contact.whatsappDisplay,
    href: `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${WHATSAPP_MESSAGE}`,
    hint: 'Same-day replies during studio hours',
    external: true,
  },
]

/**
 * Dedicated contact page: hero, direct channels, enquiry form, visit band.
 * Form is frontend-only until a backend is wired.
 */
export function ContactPage() {
  return (
    <>
      <section data-nav-hero className="relative min-h-[64vh] overflow-hidden bg-ink md:min-h-[70vh]">
        <Image
          src={HERO}
          alt="Daylit studio workspace with long desks"
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR}
          sizes="100vw"
          className="object-cover"
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

        <Container className="relative flex min-h-[64vh] flex-col justify-end pb-16 pt-36 md:min-h-[70vh] md:pb-20 md:pt-44">
          <Reveal>
            <p className="text-eyebrow uppercase text-bone/65">Contact</p>
            <h1 className="mt-5 max-w-3xl text-display-xl text-bone">
              Tell us about the site.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-bone/75">
              Share where you are building and what you need from the space. We come
              back within two working days with an honest next step.
            </p>
            <div className="mt-10">
              <ArrowLink href="#enquiry" tone="bone">
                Go to enquiry form
              </ArrowLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <SectionHead
            index="01"
            title="Reach the studio directly"
            standfirst="Pick the channel that fits. The form below is for a fuller brief - phone and WhatsApp if you want to talk sooner."
          />

          <ul className="mt-16 divide-y divide-line border-y border-line md:mt-20">
            {channels.map((channel, index) => (
              <Reveal key={channel.label} delay={index * 0.06}>
                <li>
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group grid gap-3 py-8 transition-colors duration-300 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
                  >
                    <span className="text-eyebrow uppercase text-clay md:col-span-2">
                      {channel.label}
                    </span>
                    <span className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-clay md:col-span-5 md:text-3xl">
                      {channel.value}
                    </span>
                    <span className="text-sm text-stone md:col-span-4 md:col-start-9 md:text-right">
                      {channel.hint}
                    </span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="enquiry" className="scroll-mt-28 border-b border-line bg-sand/35 py-section">
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-eyebrow uppercase text-clay">Enquiry</p>
                <h2 className="mt-4 text-display-lg text-ink">Start a project</h2>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-stone">
                  The more you tell us about plot, programme and budget, the clearer our
                  first reply. Nothing here is a binding quote.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-12">
                  <ContactForm variant="full" idPrefix="page-" />
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9 lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={0.1}>
                <p className="text-eyebrow uppercase text-clay">What happens next</p>
                <ol className="mt-6 divide-y divide-line border-y border-line">
                  {nextSteps.map((step) => (
                    <li key={step.index} className="py-6">
                      <span className="text-eyebrow uppercase text-clay">{step.index}</span>
                      <h3 className="mt-3 font-display text-xl text-ink">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone">{step.text}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 text-sm leading-relaxed text-stone">
                  Hours: {siteConfig.contact.hours}
                </p>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid items-start gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <p className="text-eyebrow uppercase text-clay">Visit</p>
              <h2 className="mt-4 text-display-lg text-ink">The studio</h2>
              <p className="mt-6 text-base leading-relaxed text-stone">
                We work from {siteConfig.contact.locationLabel}. Book ahead if you want a
                walkthrough of drawings or a live programme board.
              </p>

              <address className="mt-10 not-italic">
                <p className="text-eyebrow uppercase text-stone/70">Address</p>
                <div className="mt-4 space-y-1.5 border-t border-line pt-5 text-base leading-relaxed text-ink">
                  {siteConfig.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </address>

              <ArrowLink href={MAPS_URL} className="mt-10" tone="clay">
                Open in Google Maps
              </ArrowLink>
            </Reveal>

            <Reveal delay={0.08} className="md:col-span-6 md:col-start-7">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-4/3 overflow-hidden bg-sand"
              >
                <Image
                  src={STUDIO}
                  alt="Bright office interior suggesting the studio workspace"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.035]"
                />
                <span
                  className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/15"
                  aria-hidden="true"
                />
                <span className="absolute bottom-5 left-5 bg-bone/92 px-4 py-2 text-eyebrow uppercase text-ink backdrop-blur-sm">
                  Get directions
                </span>
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-sand/35 py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-6">
              <h2 className="text-display-md text-ink">Follow the practice</h2>
              <p className="mt-5 max-w-prose text-sm text-stone">
                Project frames and studio notes - the quieter side of the work.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-5 md:col-start-8">
              <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 md:justify-end">
                {(
                  [
                    ['Instagram', siteConfig.social.instagram],
                    ['LinkedIn', siteConfig.social.linkedin],
                    ['Facebook', siteConfig.social.facebook],
                    ['X', siteConfig.social.x],
                  ] as const
                ).map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stone transition-colors duration-300 hover:text-clay"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
