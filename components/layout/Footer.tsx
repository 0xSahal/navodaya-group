import { navLinks, siteConfig } from '@/lib/site-config'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/brand/Logo'
import { getServices } from '@/sanity/content'

export async function Footer() {
  const services = await getServices()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-mute bg-ink text-bone">
      <Container>
        <div className="grid gap-12 py-20 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <Logo
              variant="lockup"
              tone="dark"
              title={siteConfig.legalName}
              className="h-24 w-auto"
            />
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-sand/60">
              Interior and architecture design, contracting and project management. Designing
              and building from our {siteConfig.contact.locationLabel} studio since{' '}
              {siteConfig.foundedYear}.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow uppercase text-sand/45">Practice</p>
            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href={`/services/${service.slug}`}
                    className="text-sm text-sand/75 transition-colors duration-300 hover:text-clay-light"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow uppercase text-sand/45">Site</p>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-sand/75 transition-colors duration-300 hover:text-clay-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-eyebrow uppercase text-sand/45">Studio</p>
            <address className="mt-6 not-italic text-sm text-sand/75">
              <p className="max-w-xs leading-snug">
                {siteConfig.contact.addressLines.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < siteConfig.contact.addressLines.length - 1 ? (
                      <br />
                    ) : null}
                  </span>
                ))}
              </p>
              <p className="mt-4">
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="tabular-nums transition-colors duration-300 hover:text-clay-light"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </p>
              <p className="mt-1">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors duration-300 hover:text-clay-light"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ink-mute py-8 text-xs text-sand/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>
            <a
              href={siteConfig.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-clay-light"
            >
              {siteConfig.credit.label}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
