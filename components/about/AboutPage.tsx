import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { BLUR } from '@/lib/images'
import { siteConfig } from '@/lib/site-config'
import { studioVisit } from '@/data/about'
import { getAboutPage, getTeam } from '@/sanity/content'

/**
 * Full About narrative: hero, story, timeline, values, stats, leadership,
 * studio visit, enquiry. One job per band; timeline is the signature move.
 */
export async function AboutPage() {
  const [about, team] = await Promise.all([getAboutPage(), getTeam()])
  const { hero: aboutHero, story: aboutStory, timeline, values, stats } = about

  return (
    <>
      <section data-nav-hero className="relative min-h-[72vh] overflow-hidden bg-ink">
        <Image
          src={aboutHero.image}
          alt={aboutHero.alt}
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

        <Container className="relative flex min-h-[72vh] flex-col justify-end pb-16 pt-36 md:pb-20 md:pt-44">
          <Reveal>
            <p className="text-eyebrow uppercase text-bone/65">{aboutHero.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl text-display-xl text-bone">{aboutHero.headline}</h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-bone/75">{aboutHero.lead}</p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid items-start gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <div className="relative aspect-3/4 overflow-hidden bg-sand">
                <Image
                  src={aboutStory.image}
                  alt={aboutStory.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08} className="md:col-span-6 md:col-start-7 md:self-center">
              <p className="text-eyebrow uppercase text-clay">Our story</p>
              <h2 className="mt-5 text-display-lg text-ink">{aboutStory.title}</h2>
              <div className="mt-8 space-y-5">
                {aboutStory.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-stone">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <SectionHead
            index="01"
            title="A practice measured in decades"
            standfirst={`From ${siteConfig.foundedYear} to today - the milestones that shaped how we design, contract and hand over.`}
          />

          <ol className="relative mt-16 md:mt-20">
            <span
              className="absolute left-[0.35rem] top-2 bottom-2 hidden w-px bg-line md:left-[7.25rem] md:block"
              aria-hidden="true"
            />
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.06}>
                <li className="relative grid gap-3 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-8 md:py-12">
                  <div className="flex items-baseline gap-4 md:col-span-3">
                    <span
                      className="mt-2.5 hidden h-1.5 w-1.5 shrink-0 bg-clay md:mt-3.5 md:block"
                      aria-hidden="true"
                    />
                    <span className="font-display text-3xl tabular-nums text-ink md:text-4xl">
                      {item.year}
                    </span>
                  </div>
                  <div className="md:col-span-8 md:col-start-5">
                    <h3 className="text-display-sm text-ink">{item.title}</h3>
                    <p className="mt-3 max-w-prose text-base leading-relaxed text-stone">
                      {item.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <SectionHead
            index="02"
            title="What we refuse to split"
            standfirst="Four principles that decide how a brief is taken, how a site is run, and what “done” means."
          />

          <ul className="mt-16 divide-y divide-line border-y border-line md:mt-20">
            {values.map((value, index) => (
              <Reveal key={value.index} delay={index * 0.06}>
                <li className="grid gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-12">
                  <span className="text-eyebrow uppercase text-clay md:col-span-1">
                    {value.index}
                  </span>
                  <h3 className="text-display-sm text-ink md:col-span-4">{value.title}</h3>
                  <p className="text-base leading-relaxed text-stone md:col-span-6 md:col-start-7">
                    {value.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-12 md:mt-24 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-display-md tabular-nums text-ink">
                      {stat.value}
                    </span>
                    <span className="mt-2 block text-sm text-stone">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <SectionHead
            index="03"
            title="Leadership"
            standfirst="The people who sign the drawings, run the programme and stay reachable past handover."
          />

          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.06}>
                <article>
                  <div className="relative aspect-3/4 overflow-hidden bg-sand">
                    <Image
                      src={member.image}
                      alt={member.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-5 text-eyebrow uppercase text-clay">{member.role}</p>
                  <h3 className="mt-2 font-display text-2xl text-ink">{member.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{member.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-6">
              <p className="text-eyebrow uppercase text-clay">Studio</p>
              <h2 className="mt-5 text-display-lg text-ink">{studioVisit.title}</h2>
              <p className="mt-6 max-w-prose text-base leading-relaxed text-stone">
                {studioVisit.text}
              </p>
              <p className="mt-4 text-sm text-stone">{studioVisit.hours}</p>
              <ArrowLink href="/contact" className="mt-10" tone="clay">
                Book a conversation
              </ArrowLink>
            </Reveal>

            <Reveal delay={0.08} className="md:col-span-5 md:col-start-8 md:self-end">
              <address className="not-italic">
                <p className="text-eyebrow uppercase text-stone/70">Address</p>
                <div className="mt-5 space-y-2 border-t border-line pt-6 text-base leading-relaxed text-ink">
                  {studioVisit.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
                <div className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-stone">
                  <a
                    href={`tel:${siteConfig.contact.phoneHref}`}
                    className="block tabular-nums transition-colors duration-300 hover:text-clay"
                  >
                    {siteConfig.contact.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="block transition-colors duration-300 hover:text-clay"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </address>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-sand/35 py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Ready to talk through a brief?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                Tell us where the site is and what you need from the space. We come back
                within two working days with an honest next step.
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
