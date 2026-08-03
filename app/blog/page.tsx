import { BlogHub } from '@/components/blog/BlogHub'
import { JsonLd } from '@/components/seo/JsonLd'
import { collectionPageSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

const description = `Notes from ${siteConfig.name} on design, programme, materials and handover - clear practice writing without filler.`

export const metadata = buildPageMetadata({
  title: 'Blog',
  description,
  path: '/blog',
})

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          path: '/blog',
          name: 'Blog',
          description,
          crumb: 'Blog',
        })}
      />
      <BlogHub />
    </>
  )
}
