import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogDetail } from '@/components/blog/BlogDetail'
import { JsonLd } from '@/components/seo/JsonLd'
import { getPost, getPostSlugs } from '@/sanity/content'
import {
  blogPostingNode,
  breadcrumbList,
  graph,
  organizationNode,
} from '@/lib/schema'
import { buildPageMetadata, truncateDescription } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Blog' }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt || undefined,
    images: [{ url: post.cover.src, alt: post.cover.alt || post.title }],
  })
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const description = truncateDescription(post.excerpt)

  return (
    <>
      <JsonLd
        data={graph(
          organizationNode(),
          blogPostingNode({
            title: post.title,
            description,
            path: `/blog/${post.slug}`,
            image: post.cover.src,
            datePublished: post.publishedAt,
            authorName: post.author.name || undefined,
          }),
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        )}
      />
      <BlogDetail post={post} />
    </>
  )
}
