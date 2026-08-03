import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { BLUR } from '@/lib/images'
import type { Project } from '@/data/projects'
import { getRelatedProjects } from '@/sanity/content'

/**
 * Project case study. Hero, then a single overview band that pairs images with
 * copy so the brief is readable in one scroll. Challenge, outcomes, related
 * work and enquiry follow.
 */
export async function ProjectDetail({ project }: { project: Project }) {
  const related = await getRelatedProjects(project.slug, 3)

  const facts = [
    { label: 'Client', value: project.client },
    { label: 'Location', value: project.location },
    { label: 'Category', value: project.category },
    { label: 'Scope', value: project.scope },
    { label: 'Year', value: project.year },
  ]

  // Prefer gallery frames; fall back to the cover so the overview never empties.
  const frames = project.gallery.length > 0
    ? project.gallery
    : [{ src: project.image, alt: project.alt }]
  const primary = frames[0]
  const secondary = frames.slice(1, 3)
  const remaining = frames.slice(3)

  return (
    <>
      <section data-nav-hero className="relative min-h-[58vh] overflow-hidden bg-ink md:min-h-[64vh]">
        <Image
          src={project.image}
          alt={project.alt}
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent to-65%"
          aria-hidden="true"
        />

        <Container className="relative flex min-h-[58vh] flex-col justify-end pb-12 pt-36 md:min-h-[64vh] md:pb-16 md:pt-44">
          <Reveal>
            <nav className="text-eyebrow uppercase text-bone/55" aria-label="Breadcrumb">
              <Link href="/projects" className="transition-colors duration-300 hover:text-bone">
                Projects
              </Link>
              <span className="mx-3 text-bone/30" aria-hidden="true">
                /
              </span>
              <span className="text-bone/75">{project.title}</span>
            </nav>

            <p className="mt-6 text-eyebrow uppercase text-clay-light">{project.category}</p>
            <h1 className="mt-3 max-w-3xl text-display-xl text-bone">{project.title}</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-bone/75">{project.lead}</p>
          </Reveal>
        </Container>
      </section>

      {/* Images + content in one composition - visible on first scroll past the hero */}
      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-4 lg:col-span-7">
              <Reveal>
                <figure>
                  <div className="relative aspect-4/3 overflow-hidden bg-sand">
                    <Image
                      src={primary.src}
                      alt={primary.alt}
                      fill
                      priority
                      placeholder="blur"
                      blurDataURL={BLUR}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-xs text-stone">{primary.alt}</figcaption>
                </figure>
              </Reveal>

              {secondary.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {secondary.map((frame, index) => (
                    <Reveal key={`${frame.src}-${index}`} delay={0.06 * (index + 1)}>
                      <figure>
                        <div className="relative aspect-4/3 overflow-hidden bg-sand">
                          <Image
                            src={frame.src}
                            alt={frame.alt}
                            fill
                            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="mt-2 text-xs text-stone">{frame.alt}</figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>

            <Reveal delay={0.08} className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <p className="text-eyebrow uppercase text-clay">Project overview</p>
              <h2 className="mt-4 text-display-md text-ink">{project.headline}</h2>

              <dl className="mt-8 divide-y divide-line border-y border-line">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 py-3.5"
                  >
                    <dt className="text-eyebrow uppercase text-stone/70">{fact.label}</dt>
                    <dd className="text-sm text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 space-y-5">
                {project.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-stone">
                    {paragraph}
                  </p>
                ))}
              </div>

              <ul className="mt-8 space-y-3 border-t border-line pt-8">
                {project.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-stone">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-clay/50" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {remaining.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {remaining.map((frame, index) => (
                <Reveal key={`${frame.src}-more-${index}`} delay={index * 0.05}>
                  <figure className="relative aspect-4/3 overflow-hidden bg-sand">
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <div className="flex items-center gap-5">
                <span className="text-eyebrow uppercase text-clay">Challenge</span>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
              </div>
              <p className="mt-8 text-base leading-relaxed text-ink/90">{project.challenge}</p>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-6 md:col-start-7">
              <div className="flex items-center gap-5">
                <span className="text-eyebrow uppercase text-clay">Approach</span>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
              </div>
              <p className="mt-8 text-base leading-relaxed text-ink/90">{project.approach}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-b border-line bg-bone py-section">
          <Container>
            <Reveal>
              <h2 className="text-display-md text-ink">Related projects</h2>
              <p className="mt-4 max-w-prose text-sm text-stone">
                More work in a similar register - or the next case on the list.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.08}>
                  <Link href={`/projects/${item.slug}`} className="group block">
                    <div className="relative aspect-4/3 overflow-hidden bg-sand">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-5 text-eyebrow uppercase text-clay">{item.category}</p>
                    <h3 className="mt-2 font-display text-2xl text-ink transition-colors duration-300 group-hover:text-clay">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone">
                      {item.location}
                      <span className="mx-2 text-line" aria-hidden="true">
                        ·
                      </span>
                      <span className="tabular-nums">{item.year}</span>
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-sand/35 py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Ready to talk through a brief?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                Share the site and what you want from a project like {project.title}. We
                come back within two working days with next steps.
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
