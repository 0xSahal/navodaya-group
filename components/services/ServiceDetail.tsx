import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { BLUR } from '@/lib/images'
import type { Service } from '@/data/services'
import { getOtherServices } from '@/sanity/content'
import { ServiceVideo } from '@/components/services/ServiceVideo'

/**
 * Individual practice page. One job per band: thesis hero, overview, programme
 * of deliverables, atmosphere video, gallery, related practices, enquiry.
 */
export async function ServiceDetail({ service }: { service: Service }) {
  const others = await getOtherServices(service.id)

  return (
    <>
      <section data-nav-hero className="relative min-h-[78vh] overflow-hidden bg-ink">
        <Image
          src={service.gallery[0]?.src ?? service.image}
          alt={service.gallery[0]?.alt ?? service.alt}
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

        <Container className="relative flex min-h-[78vh] flex-col justify-end pb-16 pt-36 md:pb-20 md:pt-44">
          <Reveal>
            <nav className="text-eyebrow uppercase text-bone/55" aria-label="Breadcrumb">
              <Link href="/services" className="transition-colors duration-300 hover:text-bone">
                Services
              </Link>
              <span className="mx-3 text-bone/30" aria-hidden="true">
                /
              </span>
              <span className="text-bone/75">{service.title}</span>
            </nav>

            <p className="mt-8 text-eyebrow uppercase text-clay-light">{service.index}</p>
            <h1 className="mt-4 max-w-3xl text-display-xl text-bone">{service.headline}</h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-bone/75">{service.lead}</p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <h2 className="text-display-md text-ink">{service.title}</h2>
              <p className="mt-5 text-base leading-relaxed text-ink/85">{service.line}</p>
              <ul className="mt-10 space-y-3 border-t border-line pt-8">
                {service.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-stone">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-clay/50" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="md:col-span-6 md:col-start-7">
              <div className="space-y-6">
                {service.body.map((paragraph) => (
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
          <Reveal>
            <div className="flex items-center gap-5">
              <span className="text-eyebrow uppercase text-clay">Programme</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
            <h2 className="mt-8 max-w-2xl text-display-lg text-ink">What you leave with</h2>
          </Reveal>

          <ol className="mt-16 divide-y divide-line border-y border-line">
            {service.deliverables.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} y={16}>
                <li className="grid gap-4 py-10 md:grid-cols-12 md:gap-8 md:py-12">
                  <span className="text-eyebrow uppercase text-clay md:col-span-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-2xl text-ink md:col-span-4">{item.title}</h3>
                  <p className="text-base leading-relaxed text-stone md:col-span-6 md:col-start-7">
                    {item.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-ink">
        <ServiceVideo
          src={service.video.src}
          poster={service.video.poster}
          caption={service.video.caption}
        />
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <Reveal>
            <div className="flex items-center gap-5">
              <span className="text-eyebrow uppercase text-clay">Selected frames</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
            <h2 className="mt-8 text-display-lg text-ink">Atmosphere from the practice</h2>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-12 md:gap-6">
            {service.gallery.map((frame, index) => {
              const wide = frame.span === 'wide'
              return (
                <Reveal
                  key={frame.src}
                  delay={index * 0.05}
                  className={wide ? 'md:col-span-7' : 'md:col-span-5'}
                >
                  <figure className="relative aspect-4/3 overflow-hidden bg-sand md:aspect-5/4">
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      sizes={wide ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 42vw, 100vw'}
                      className="object-cover"
                    />
                  </figure>
                  <figcaption className="mt-3 text-xs text-stone">{frame.alt}</figcaption>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <Reveal>
            <h2 className="text-display-md text-ink">The other practices</h2>
            <p className="mt-4 max-w-prose text-sm text-stone">
              Most projects cross more than one. Keep them under the same roof.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {others.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.08}>
                <Link href={`/services/${item.slug}`} className="group grid gap-6 sm:grid-cols-5">
                  <div className="relative aspect-4/3 overflow-hidden bg-sand sm:col-span-2 sm:aspect-square">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 640px) 20vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="sm:col-span-3 sm:self-center">
                    <p className="text-eyebrow uppercase text-clay">{item.index}</p>
                    <h3 className="mt-3 font-display text-2xl text-ink transition-colors duration-300 group-hover:text-clay">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone">{item.line}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bone py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Ready to talk through a brief?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                Share the site and what you want from {service.title.toLowerCase()}. We come
                back within two working days with next steps.
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
