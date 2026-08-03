import { ProjectsHub } from '@/components/projects/ProjectsHub'
import { JsonLd } from '@/components/seo/JsonLd'
import { collectionPageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

const description = `Selected houses, workplaces and interiors by ${siteConfig.name}. Drawn and built under one contract - from brief to handover.`

export const metadata = buildPageMetadata({
  title: 'Projects',
  description,
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          path: '/projects',
          name: 'Projects',
          description,
          crumb: 'Projects',
        })}
      />
      <ProjectsHub />
    </>
  )
}
