'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import {
  navLinks,
  siteConfig,
  whoWeAreLinks,
  type NavMenu,
} from '@/lib/site-config'
import type { Service } from '@/data/services'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/brand/Logo'

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 9.5H3.8V20H6.5V9.5zM5.15 4A1.6 1.6 0 1 0 5.16 7.2 1.6 1.6 0 0 0 5.15 4zM20.2 20h-2.7v-5.6c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98V20H10.8V9.5h2.58v1.43h.04c.36-.68 1.24-1.4 2.55-1.4 2.73 0 3.23 1.8 3.23 4.13V20z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.525-8.61L1.5 2.25h7.08l4.263 5.676L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'Facebook', href: siteConfig.social.facebook, icon: <FacebookIcon /> },
  { label: 'Instagram', href: siteConfig.social.instagram, icon: <InstagramIcon /> },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: <LinkedinIcon /> },
  { label: 'X', href: siteConfig.social.x, icon: <XIcon /> },
]

const locationLine = siteConfig.contact.locationLabel

/** Routes with a dark full-bleed hero the nav can sit over (same as home). */
function pageHasNavHero(pathname: string) {
  if (pathname === '/') return true
  if (pathname === '/blog') return true
  if (pathname.startsWith('/blog/')) return false
  if (pathname.startsWith('/services')) return true
  if (pathname.startsWith('/projects')) return true
  if (pathname.startsWith('/about')) return true
  if (pathname.startsWith('/contact')) return true
  if (pathname.startsWith('/vendors')) return true
  return false
}

/**
 * Two-tier fixed header with Services and Who we are dropdowns.
 */
export function Header({ services }: { services: Service[] }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const hasNavHero = pageHasNavHero(pathname)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => !pageHasNavHero(pathname))
  const [desktopMenu, setDesktopMenu] = useState<NavMenu | null>(null)
  const [mobileMenu, setMobileMenu] = useState<NavMenu | null>(null)
  const servicesDropdownId = useId()
  const whoWeAreDropdownId = useId()
  const navRef = useRef<HTMLDivElement>(null)

  /*
   * Reset the menus on navigation by adjusting state during render rather than
   * from an effect. Doing it in an effect makes React render the new route with
   * the old menu still open, then immediately render again — the cascading
   * render the lint rule warns about.
   */
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
    setDesktopMenu(null)
    setMobileMenu(null)
    setScrolled(!pageHasNavHero(pathname))
  }

  /** Transparent over the page hero until the visitor scrolls past it. */
  const overHero = hasNavHero && !scrolled && !open
  const ctaHref = isHome ? '#contact' : '/contact'
  const navTone = overHero
    ? 'text-bone/75 hover:text-bone'
    : 'text-stone hover:text-ink'
  const logoTone = overHero ? 'dark' : 'light'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    // Routes without a full-bleed hero keep the solid header, so there is
    // nothing to measure and no listener to attach.
    if (!hasNavHero) return

    /*
     * Re-query on every scroll rather than capturing the element once: during a
     * client-side navigation this effect can run before the incoming page's
     * hero has committed, and a captured null would leave the header stuck in
     * its solid state on a page that does have a hero. The viewport fallback
     * covers that first frame.
     */
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>('[data-nav-hero]')
      const heroHeight = hero?.offsetHeight ?? window.innerHeight
      setScrolled(window.scrollY > heroHeight * 0.72)
    }

    // Measure once on mount: a reload part-way down the page must not start
    // with a transparent header over light content.
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname, hasNavHero])

  useEffect(() => {
    if (!desktopMenu) return

    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setDesktopMenu(null)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDesktopMenu(null)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [desktopMenu])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-premium ${
        overHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-line bg-bone'
      }`}
    >
      <div
        className={`hidden border-b md:block ${
          overHero ? 'border-bone/20 bg-ink/45' : 'border-line bg-sand/50'
        }`}
      >
        <Container>
          <div
            className={`flex h-10 items-center justify-between gap-6 text-xs ${
              overHero ? 'text-bone/70' : 'text-stone'
            }`}
          >
            <div className="flex min-w-0 items-center gap-5 xl:gap-6">
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className={`inline-flex shrink-0 items-center gap-2 transition-colors duration-300 ${
                  overHero ? 'hover:text-bone' : 'hover:text-ink'
                }`}
              >
                <Phone size={13} strokeWidth={1.75} aria-hidden="true" />
                <span className="tabular-nums">{siteConfig.contact.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className={`hidden shrink-0 items-center gap-2 transition-colors duration-300 xl:inline-flex ${
                  overHero ? 'hover:text-bone' : 'hover:text-ink'
                }`}
              >
                <Mail size={13} strokeWidth={1.75} aria-hidden="true" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <p className="hidden min-w-0 items-center gap-2 truncate lg:flex">
                <MapPin size={13} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{locationLine}</span>
              </p>
            </div>

            <ul className="flex shrink-0 items-center gap-1" aria-label="Social">
              {socialLinks.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`inline-flex size-8 items-center justify-center transition-colors duration-300 ${
                      overHero ? 'text-bone/70 hover:text-bone' : 'text-stone hover:text-ink'
                    }`}
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex h-20 items-center justify-between gap-6 md:h-[5.25rem]">
          <Link
            href="/"
            aria-label={`${siteConfig.legalName}, home`}
            className="flex shrink-0 items-center"
          >
            <Logo
              variant="lockup"
              tone={logoTone}
              title={siteConfig.legalName}
              className="h-12 w-auto md:h-14"
            />
          </Link>

          <div className="flex items-center gap-6 xl:gap-10">
            <nav
              ref={navRef}
              className="hidden items-center gap-7 xl:gap-9 lg:flex"
              aria-label="Primary"
            >
              {navLinks.map((link) => {
                if (!('menu' in link) || !link.menu) {
                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={`group relative text-eyebrow uppercase transition-colors duration-300 ${navTone}`}
                    >
                      {link.label}
                      <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-clay transition-transform duration-400 ease-premium group-hover:scale-x-100" />
                    </Link>
                  )
                }

                const menu = link.menu
                const isOpen = desktopMenu === menu
                const panelId = menu === 'services' ? servicesDropdownId : whoWeAreDropdownId

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDesktopMenu(menu)}
                    onMouseLeave={() => setDesktopMenu(null)}
                  >
                    <div className="flex items-center gap-1">
                      <Link
                        href={link.href}
                        className={`group relative text-eyebrow uppercase transition-colors duration-300 ${navTone}`}
                      >
                        {link.label}
                        <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-clay transition-transform duration-400 ease-premium group-hover:scale-x-100" />
                      </Link>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-haspopup="menu"
                        aria-label={`Open ${link.label} menu`}
                        onClick={() => setDesktopMenu((value) => (value === menu ? null : menu))}
                        className={`p-0.5 transition-colors duration-300 ${navTone}`}
                      >
                        <ChevronDown
                          size={14}
                          strokeWidth={1.75}
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      role="menu"
                      aria-label={link.label}
                      className={`absolute left-0 top-full z-50 min-w-[17rem] pt-3 transition-[opacity,transform] duration-300 ease-premium ${
                        isOpen
                          ? 'pointer-events-auto translate-y-0 opacity-100'
                          : 'pointer-events-none -translate-y-1 opacity-0'
                      }`}
                    >
                      {menu === 'services' ? (
                        <ul className="border border-line bg-bone py-2 shadow-lift">
                          <li>
                            <Link
                              href="/services"
                              role="menuitem"
                              className="block px-5 py-2.5 text-sm text-stone transition-colors duration-300 hover:bg-sand/60 hover:text-ink"
                              onClick={() => setDesktopMenu(null)}
                            >
                              All services
                            </Link>
                          </li>
                          <li className="mx-5 my-1.5 h-px bg-line" aria-hidden="true" />
                          {services.map((service) => (
                            <li key={service.id}>
                              <Link
                                href={`/services/${service.slug}`}
                                role="menuitem"
                                className="flex items-baseline justify-between gap-6 px-5 py-2.5 transition-colors duration-300 hover:bg-sand/60"
                                onClick={() => setDesktopMenu(null)}
                              >
                                <span className="text-sm text-ink">{service.title}</span>
                                <span className="text-eyebrow uppercase text-clay">
                                  {service.index}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="border border-line bg-bone py-2 shadow-lift">
                          {whoWeAreLinks.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                role="menuitem"
                                className="block px-5 py-3 transition-colors duration-300 hover:bg-sand/60"
                                onClick={() => setDesktopMenu(null)}
                              >
                                <span className="block text-sm text-ink">{item.label}</span>
                                <span className="mt-1 block text-xs text-stone">{item.line}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              })}
            </nav>

            <Link
              href={ctaHref}
              className={`hidden px-5 py-2.5 text-eyebrow uppercase tracking-[0.18em] transition-colors duration-300 sm:inline-flex ${
                overHero
                  ? 'bg-bone text-ink hover:bg-sand'
                  : 'bg-ink text-bone hover:bg-ink-soft'
              }`}
            >
              Start a project
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`-mr-2 cursor-pointer p-2 transition-colors duration-300 lg:hidden ${
                overHero ? 'text-bone' : 'text-ink'
              }`}
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={`overflow-hidden border-t border-line bg-bone transition-[max-height] duration-500 ease-premium lg:hidden ${
          open ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0 border-t-0'
        }`}
      >
        <Container>
          <nav className="flex flex-col py-4" aria-label="Mobile">
            {navLinks.map((link) => {
              if (!('menu' in link) || !link.menu) {
                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-line py-4 font-display text-2xl text-ink last:border-b-0"
                  >
                    {link.label}
                  </Link>
                )
              }

              const menu = link.menu
              const isOpen = mobileMenu === menu

              return (
                <div key={link.label} className="border-b border-line">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="py-4 font-display text-2xl text-ink"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={isOpen ? `Hide ${link.label}` : `Show ${link.label}`}
                      onClick={() => setMobileMenu((value) => (value === menu ? null : menu))}
                      className="p-2 text-ink"
                    >
                      <ChevronDown
                        size={20}
                        strokeWidth={1.5}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-400 ease-premium ${
                      isOpen ? 'max-h-80 pb-4' : 'max-h-0'
                    }`}
                  >
                    {menu === 'services' ? (
                      <ul className="space-y-1 border-l border-line pl-5">
                        {services.map((service) => (
                          <li key={service.id}>
                            <Link
                              href={`/services/${service.slug}`}
                              onClick={() => setOpen(false)}
                              className="block py-2.5 text-sm text-stone transition-colors duration-300 hover:text-ink"
                            >
                              <span className="mr-3 text-eyebrow uppercase text-clay">
                                {service.index}
                              </span>
                              {service.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-1 border-l border-line pl-5">
                        {whoWeAreLinks.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="block py-2.5 text-sm text-stone transition-colors duration-300 hover:text-ink"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="py-4 text-sm tabular-nums text-clay"
            >
              {siteConfig.contact.phoneDisplay}
            </a>
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mb-2 inline-flex w-fit bg-ink px-5 py-2.5 text-eyebrow uppercase tracking-[0.18em] text-bone"
            >
              Start a project
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  )
}
