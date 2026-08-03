import { siteConfig } from '@/lib/site-config'
import { absoluteUrl } from '@/lib/seo'

type JsonLd = Record<string, unknown>

const ORG_ID = `${siteConfig.url}/#organization`
const WEBSITE_ID = `${siteConfig.url}/#website`
const BUSINESS_ID = `${siteConfig.url}/#business`

function logoUrl(): string {
  // Raster mark for Organization.logo (Google prefers crawlable PNG/JPEG).
  return absoluteUrl('/icon.png')
}

function postalAddress(): JsonLd {
  const lines = siteConfig.contact.addressLines
  return {
    '@type': 'PostalAddress',
    streetAddress: lines.slice(0, 3).join(', '),
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    postalCode: '110044',
    addressCountry: 'IN',
  }
}

function sameAs(): string[] {
  return Object.values(siteConfig.social).filter(Boolean)
}

/** Shared Organization node referenced by other graphs. */
export function organizationNode(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl(),
    },
    image: logoUrl(),
    foundingDate: String(siteConfig.foundedYear),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref,
    address: postalAddress(),
    sameAs: sameAs(),
  }
}

/**
 * Local professional practice. Uses ProfessionalService (a LocalBusiness
 * subtype) so Google can attach NAP without inventing a category we are not.
 */
export function professionalServiceNode(): JsonLd {
  return {
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    image: logoUrl(),
    telephone: siteConfig.contact.phoneHref,
    email: siteConfig.contact.email,
    address: postalAddress(),
    openingHours: 'Mo-Sa 10:00-19:00',
    priceRange: '$$',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Delhi NCR',
    },
    sameAs: sameAs(),
    parentOrganization: { '@id': ORG_ID },
  }
}

export function webSiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  }
}

export function breadcrumbList(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function webPageNode(input: {
  path: string
  name: string
  description: string
  type?: 'WebPage' | 'ContactPage' | 'CollectionPage' | 'AboutPage'
}): JsonLd {
  return {
    '@type': input.type ?? 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-IN',
  }
}

export function serviceNode(input: {
  name: string
  description: string
  path: string
  image?: string
}): JsonLd {
  return {
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: input.image } : {}),
    provider: { '@id': BUSINESS_ID },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Delhi NCR',
    },
  }
}

export function projectNode(input: {
  name: string
  description: string
  path: string
  image?: string
  dateCreated?: string
}): JsonLd {
  return {
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: input.image } : {}),
    ...(input.dateCreated ? { dateCreated: input.dateCreated } : {}),
    creator: { '@id': ORG_ID },
    provider: { '@id': BUSINESS_ID },
    inLanguage: 'en-IN',
  }
}

export function blogPostingNode(input: {
  title: string
  description: string
  path: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName?: string
}): JsonLd {
  return {
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    ...(input.image ? { image: input.image } : {}),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: input.authorName || siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: siteConfig.legalName,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl(),
      },
    },
    inLanguage: 'en-IN',
  }
}

export function graph(...nodes: JsonLd[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

/** Homepage: org + site + local practice in one graph. */
export function homePageSchema(): JsonLd {
  return graph(organizationNode(), webSiteNode(), professionalServiceNode())
}

export function aboutPageSchema(description: string): JsonLd {
  return graph(
    organizationNode(),
    webPageNode({
      path: '/about',
      name: `About | ${siteConfig.name}`,
      description,
      type: 'AboutPage',
    }),
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  )
}

export function contactPageSchema(description: string): JsonLd {
  return graph(
    organizationNode(),
    professionalServiceNode(),
    webPageNode({
      path: '/contact',
      name: `Contact | ${siteConfig.name}`,
      description,
      type: 'ContactPage',
    }),
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  )
}

export function collectionPageSchema(input: {
  path: string
  name: string
  description: string
  crumb: string
}): JsonLd {
  return graph(
    organizationNode(),
    webPageNode({
      path: input.path,
      name: `${input.name} | ${siteConfig.name}`,
      description: input.description,
      type: 'CollectionPage',
    }),
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: input.crumb, path: input.path },
    ]),
  )
}

export function simplePageSchema(input: {
  path: string
  name: string
  description: string
  crumb: string
}): JsonLd {
  return graph(
    organizationNode(),
    webPageNode({
      path: input.path,
      name: `${input.name} | ${siteConfig.name}`,
      description: input.description,
    }),
    breadcrumbList([
      { name: 'Home', path: '/' },
      { name: input.crumb, path: input.path },
    ]),
  )
}
