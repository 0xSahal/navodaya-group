import type { MetadataRoute } from 'next'
import {
  getPostSlugs,
  getProjectSlugs,
  getServiceSlugs,
} from '@/sanity/content'
import { absoluteUrl } from '@/lib/seo'

// Must be a numeric literal. An imported constant (e.g. CONTENT_REVALIDATE)
// fails Next's static segment-config check at build time.
export const revalidate = 3600

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency']

function entry(
  path: string,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, serviceSlugs, postSlugs] = await Promise.all([
    getProjectSlugs(),
    getServiceSlugs(),
    getPostSlugs(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', 'weekly', 1),
    entry('/about', 'monthly', 0.8),
    entry('/services', 'monthly', 0.9),
    entry('/projects', 'weekly', 0.9),
    entry('/blog', 'weekly', 0.7),
    entry('/contact', 'monthly', 0.8),
    entry('/vendors-register', 'monthly', 0.4),
  ]

  return [
    ...staticRoutes,
    ...serviceSlugs.map((slug) => entry(`/services/${slug}`, 'monthly', 0.8)),
    ...projectSlugs.map((slug) => entry(`/projects/${slug}`, 'monthly', 0.7)),
    ...postSlugs.map((slug) => entry(`/blog/${slug}`, 'monthly', 0.6)),
  ]
}
