import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/services/ServiceDetail'
import { JsonLd } from '@/components/seo/JsonLd'
import { getService, getServiceSlugs } from '@/sanity/content'
import {
  breadcrumbList,
  graph,
  organizationNode,
  professionalServiceNode,
  serviceNode,
} from '@/lib/schema'
import { buildPageMetadata, truncateDescription } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Service' }

  return buildPageMetadata({
    title: service.title,
    description: `${service.line} ${service.detail}`,
    path: `/services/${service.slug}`,
    images: [{ url: service.image, alt: service.alt || service.title }],
  })
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const description = truncateDescription(
    service.lead || `${service.line} ${service.detail}`,
  )

  return (
    <>
      <JsonLd
        data={graph(
          organizationNode(),
          professionalServiceNode(),
          serviceNode({
            name: service.title,
            description,
            path: `/services/${service.slug}`,
            image: service.image,
          }),
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        )}
      />
      <ServiceDetail service={service} />
    </>
  )
}
