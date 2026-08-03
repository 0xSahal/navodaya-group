import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { VendorRegistrationForm } from '@/components/vendors/VendorRegistrationForm'
import { vendorCategories } from '@/data/vendors'
import { siteConfig } from '@/lib/site-config'
import { BLUR, unsplash } from '@/lib/images'

const HERO = unsplash('photo-1503387762-592deb58ef4e', 2400)
const SIDE = unsplash('photo-1454165804606-c3d57bc86b40', 1200)

/**
 * Vendor registration: hero, form with brief fields, category legend.
 */
export function VendorRegistrationPage() {
  return (
    <>
      <section data-nav-hero className="relative min-h-[56vh] overflow-hidden bg-ink md:min-h-[62vh]">
        <Image
          src={HERO}
          alt="Architectural drawings on a work table"
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

        <Container className="relative flex min-h-[56vh] flex-col justify-end pb-14 pt-36 md:min-h-[62vh] md:pb-16 md:pt-44">
          <Reveal>
            <nav className="text-eyebrow uppercase text-bone/55" aria-label="Breadcrumb">
              <Link href="/about" className="transition-colors duration-300 hover:text-bone">
                Who we are
              </Link>
              <span className="mx-3 text-bone/30" aria-hidden="true">
                /
              </span>
              <span className="text-bone/75">Vendor registration</span>
            </nav>
            <p className="mt-6 text-eyebrow uppercase text-clay-light">Vendors</p>
            <h1 className="mt-4 max-w-3xl text-display-xl text-bone">
              Register to work with the studio.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bone/75">
              Sub-contractors, material suppliers and specialists - tell us who you are and
              what you deliver. We review registrations against live project needs.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <VendorRegistrationForm />
              </Reveal>
            </div>

            <aside className="space-y-10 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={0.08}>
                <div className="relative aspect-4/3 overflow-hidden bg-sand">
                  <Image
                    src={SIDE}
                    alt="Hands reviewing project documents at a desk"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="text-eyebrow uppercase text-clay">Categories we accept</p>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {vendorCategories.map((group) => (
                    <li key={group.group} className="py-5">
                      <p className="text-sm font-medium text-ink">{group.group}</p>
                      <p className="mt-2 text-sm text-stone">
                        {group.options.map((option) => option.label).join(' · ')}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-stone">
                  Questions before you apply?{' '}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-clay"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
