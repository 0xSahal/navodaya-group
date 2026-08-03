import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { JsonLd } from '@/components/seo/JsonLd'
import { getProject, getProjectSlugs } from '@/sanity/content'
import {
  breadcrumbList,
  graph,
  organizationNode,
  projectNode,
} from '@/lib/schema'
import { buildPageMetadata, truncateDescription } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project' }

  return buildPageMetadata({
    title: project.title,
    description: project.lead,
    path: `/projects/${project.slug}`,
    images: [{ url: project.image, alt: project.alt || project.title }],
  })
}

export default async function ProjectSlugPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const description = truncateDescription(project.lead)

  return (
    <>
      <JsonLd
        data={graph(
          organizationNode(),
          projectNode({
            name: project.title,
            description,
            path: `/projects/${project.slug}`,
            image: project.image,
            dateCreated: project.year || undefined,
          }),
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        )}
      />
      <ProjectDetail project={project} />
    </>
  )
}
