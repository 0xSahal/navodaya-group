import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { getAllProjects, getProjectFilters } from '@/sanity/content'
import { siteConfig } from '@/lib/site-config'

const HUB_HERO = '/images/projects/hero.png'

/**
 * Projects index: thesis hero, credentials strip, then a uniform project grid.
 */
export async function ProjectsHub() {
  const [projects, filters] = await Promise.all([getAllProjects(), getProjectFilters()])
  const count = String(projects.length).padStart(2, '0')

  return (
    <>
      <section data-nav-hero className="relative min-h-[72vh] overflow-hidden bg-ink">
        <Image
          src={HUB_HERO}
          alt="Completed modern residence at dusk, built work from brief to handover"
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

        <Container className="relative flex min-h-[72vh] flex-col justify-end pb-16 pt-36 md:pb-20 md:pt-44">
          <Reveal>
            <p className="text-eyebrow uppercase text-bone/65">Projects</p>
            <h1 className="mt-5 max-w-3xl text-display-xl text-bone">
              Work that was drawn
              <span className="mt-2 block">and built to last.</span>
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-bone/75">
              Residential, commercial and interior projects delivered by{' '}
              {siteConfig.shortName} - one studio accountable from brief to handover.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-7">
              <p className="text-eyebrow uppercase text-clay">Practice portfolio</p>
              <h2 className="mt-5 max-w-2xl text-display-lg text-ink">
                Clear work. Clear accountability. Twenty years of delivery.
              </h2>
              <p className="mt-6 max-w-prose text-base leading-relaxed text-stone">
                Browse by typology, open a case for the brief and approach, and see how
                design, contracting and project management stay under the same roof.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="md:col-span-4 md:col-start-9 md:self-end">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8">
                <div>
                  <dt className="text-eyebrow uppercase text-stone/70">Shown here</dt>
                  <dd className="mt-2 font-display text-3xl tabular-nums text-ink">{count}</dd>
                </div>
                <div>
                  <dt className="text-eyebrow uppercase text-stone/70">Experience</dt>
                  <dd className="mt-2 font-display text-3xl tabular-nums text-ink">
                    {siteConfig.yearsOfExperience}+
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-eyebrow uppercase text-stone/70">Coverage</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink">
                    Residential · Commercial · Interior
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <SectionHead
            index="01"
            title="All projects"
            standfirst="Filter by type, then open any case for scope, approach and selected frames."
          />

          <ProjectGrid projects={projects} filters={filters} className="mt-14 md:mt-16" />
        </Container>
      </section>

      <section className="bg-bone py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Have a site and a brief in mind?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                Tell us where you are building and what you need from the space. We come
                back within two working days with an honest next step.
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
