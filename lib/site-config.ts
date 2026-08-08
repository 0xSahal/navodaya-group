/**
 * Single source of truth for brand and contact details. Every section reads
 * from here, so rebranding the demo is a one-file edit.
 */
export const siteConfig = {
  name: 'Navodaya Design and Contract',
  legalName: 'Navodaya Design and Contract Pvt Ltd',
  shortName: 'Navodaya',
  tagline: 'Designed and built, under one roof',
  description:
    'Navodaya Design and Contract is an interior and architecture design, contracting and project management firm. Twenty years of designing and building homes, offices and commercial spaces end to end.',
  url: 'https://navodayagroup.in/',
  foundedYear: 2005,
  yearsOfExperience: 20,

  /*
   * One real number, in three shapes: display, `tel:` href, and the wa.me form
   * (country code plus number, digits only, no `+` or spaces). Change it here
   * and the header, footer, contact block, both WhatsApp buttons and the form
   * confirmation all follow.
   */
  contact: {
    phoneDisplay: '+91 98112 62599',
    phoneHref: '+919811262599',
    whatsappNumber: '919811262599',
    whatsappDisplay: '+91 98112 62599',
    email: 'admin@navodayagroup.in',
    addressLines: [
      'A - 24/9, Mohan Co-operative Industrial Estate',
      'Mathura Road, Saidabad Mohan C, Block B-1',
      'Mohan Cooperative Industrial Estate, Badarpur',
      'New Delhi, Delhi 110044',
    ],
    /** Short label for the header utility strip. */
    locationLabel: 'Mohan Industrial Estate, New Delhi',
    hours: 'Monday to Saturday, 10am to 7pm IST',
  },

  social: {
    facebook: 'https://www.facebook.com/navodayagroup',
    instagram: 'https://instagram.com/navodayagroup',
    linkedin: 'https://www.linkedin.com/company/navodayagroup',
    x: 'https://x.com/navodayagroup',
  },

  credit: {
    label: 'Designed & built by Sharp Builder',
    href: 'https://sahalshaikh.com/',
  },
} as const

/** Nested items under the Who we are header menu. */
export const whoWeAreLinks = [
  {
    label: 'About',
    href: '/about',
    line: 'Studio story, timeline and leadership',
  },
  {
    label: 'Vendor registration',
    href: '/vendors-register',
    line: 'Apply to join our vendor network',
  },
] as const

export type NavMenu = 'services' | 'whoWeAre'

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services', menu: 'services' as const },
  { label: 'Projects', href: '/projects' },
  { label: 'Who we are', href: '/about', menu: 'whoWeAre' as const },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const
