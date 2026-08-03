/**
 * Migrates the hard-coded content in `data/*` into Sanity.
 *
 * Safe to re-run: every document is matched by a stable natural key (slug, or a
 * fixed id for singletons) and replaced in place, so running twice updates
 * rather than duplicates. Image assets are deduplicated by source URL within a
 * run, and Sanity itself deduplicates identical bytes across runs.
 *
 *   npx tsx scripts/seed-sanity.ts          # dry run, reports what it would do
 *   npx tsx scripts/seed-sanity.ts --write  # actually writes
 */
import { config as loadEnv } from 'dotenv'
import { createClient } from '@sanity/client'

// Next reads .env.local automatically; a standalone script has to be told.
loadEnv({ path: '.env.local', quiet: true })

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { projects } from '../data/projects'
import { services } from '../data/services'
import { posts, type BlogBlock } from '../data/blog'
import { testimonials } from '../data/testimonials'
import { heroSlides } from '../data/hero'
import { reasons, processSteps, studioImage } from '../data/studio'
import { aboutHero, aboutStory, timeline, values, team } from '../data/about'
import { siteConfig } from '../lib/site-config'

const WRITE = process.argv.includes('--write')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN in .env.local',
  )
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-01',
  useCdn: false,
})

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

let uploaded = 0
let reused = 0

/** Cache so the same source image is only uploaded once per run. */
const assetCache = new Map<string, string>()

/**
 * Uploads a local file or remote URL and returns the asset id.
 *
 * Sanity hashes uploads, so re-running does not pile up duplicate assets even
 * though this cache only lives for one run.
 */
async function uploadImage(src: string, label: string): Promise<string | null> {
  const cached = assetCache.get(src)
  if (cached) {
    reused += 1
    return cached
  }

  if (!WRITE) {
    assetCache.set(src, 'dry-run-asset')
    uploaded += 1
    return 'dry-run-asset'
  }

  try {
    let body: Buffer
    let filename: string

    if (src.startsWith('http')) {
      const response = await fetch(src)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      body = Buffer.from(await response.arrayBuffer())
      // Unsplash ids are more useful as filenames than the whole query string.
      const id = src.match(/photo-[\w-]+/)?.[0] ?? 'image'
      filename = `${id}.jpg`
    } else {
      const filePath = path.join(PUBLIC_DIR, src.replace(/^\//, ''))
      body = await readFile(filePath)
      filename = path.basename(filePath)
    }

    const asset = await client.assets.upload('image', body, { filename })
    assetCache.set(src, asset._id)
    uploaded += 1
    return asset._id
  } catch (error) {
    console.warn(`  ! image failed (${label}): ${src}\n    ${(error as Error).message}`)
    return null
  }
}

type FigureInput = { src: string; alt: string; caption?: string; span?: string }

async function figure(input: FigureInput | undefined, label: string) {
  if (!input?.src) return undefined
  const assetId = await uploadImage(input.src, label)
  if (!assetId) return undefined
  return {
    _type: 'figure',
    asset: { _type: 'reference', _ref: assetId },
    alt: input.alt ?? '',
    ...(input.caption ? { caption: input.caption } : {}),
    emphasis: input.span === 'wide' ? 'wide' : 'normal',
  }
}

/** Array members that are objects need a stable `_key`. */
const keyed = <T extends object>(items: T[]) =>
  items.map((item) => ({ _key: randomUUID().slice(0, 12), ...item }))

/** Plain paragraphs into Portable Text. */
const toBlocks = (paragraphs: string[]) =>
  paragraphs.filter(Boolean).map((text) => ({
    _type: 'block',
    _key: randomUUID().slice(0, 12),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: randomUUID().slice(0, 12), text, marks: [] }],
  }))

/** The blog's block union into Portable Text, uploading any inline images. */
async function blogBodyToPortableText(body: BlogBlock[], label: string) {
  const out: Record<string, unknown>[] = []

  for (const block of body) {
    const _key = randomUUID().slice(0, 12)

    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') {
      const text = block.type === 'quote' ? block.text : block.text
      const style =
        block.type === 'paragraph'
          ? 'normal'
          : block.type === 'quote'
            ? 'blockquote'
            : block.level === 3
              ? 'h3'
              : 'h2'
      out.push({
        _type: 'block',
        _key,
        style,
        markDefs: [],
        children: [{ _type: 'span', _key: randomUUID().slice(0, 12), text, marks: [] }],
      })
      continue
    }

    if (block.type === 'list') {
      for (const item of block.items) {
        out.push({
          _type: 'block',
          _key: randomUUID().slice(0, 12),
          style: 'normal',
          listItem: block.ordered ? 'number' : 'bullet',
          level: 1,
          markDefs: [],
          children: [{ _type: 'span', _key: randomUUID().slice(0, 12), text: item, marks: [] }],
        })
      }
      continue
    }

    if (block.type === 'image') {
      const fig = await figure(
        { src: block.src, alt: block.alt, caption: block.caption },
        `${label} body image`,
      )
      if (fig) out.push({ ...fig, _key })
    }
  }

  return out
}

/**
 * Finds an existing document by a natural key so re-runs update in place.
 * Sanity assigns the id on first create; we never invent one.
 */
async function idForSlug(type: string, slug: string): Promise<string | undefined> {
  if (!WRITE) return undefined
  const existing = await client.fetch<string | null>(
    `*[_type == $type && slug.current == $slug][0]._id`,
    { type, slug },
  )
  return existing ?? undefined
}

async function idForField(type: string, field: string, value: string) {
  if (!WRITE) return undefined
  const existing = await client.fetch<string | null>(
    `*[_type == $type && ${field} == $value][0]._id`,
    { type, value },
  )
  return existing ?? undefined
}

const created: string[] = []

async function put(doc: Record<string, unknown>, existingId?: string) {
  const label = `${doc._type as string}: ${
    (doc.title as string) ?? (doc.internalTitle as string) ?? (doc.author as string) ?? doc._id
  }`
  created.push(label)
  if (!WRITE) return { _id: 'dry-run' }
  if (existingId) return client.createOrReplace({ ...doc, _id: existingId } as never)
  if (doc._id) return client.createOrReplace(doc as never)
  return client.create(doc as never)
}

/** Maps the layout's span/ratio pair onto the three presets the schema exposes. */
function emphasisFor(span: number, ratio: string) {
  if (ratio === 'portrait') return 'tall'
  return span >= 7 ? 'wide' : 'standard'
}

async function main() {
  console.log(
    `\n${WRITE ? 'WRITING to' : 'DRY RUN against'} ${projectId}/${dataset}\n${'─'.repeat(52)}`,
  )

  // ---- Taxonomies first, so documents can reference real ids ---------------
  const projectCategoryIds = new Map<string, string>()
  const uniqueProjectCategories = [...new Set(projects.map((p) => p.category))]

  for (const [index, title] of uniqueProjectCategories.entries()) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = await idForSlug('projectCategory', slug)
    const doc = {
      _type: 'projectCategory',
      title,
      slug: { _type: 'slug', current: slug },
      order: (index + 1) * 10,
    }
    const result = (await put(doc, existing)) as { _id: string }
    projectCategoryIds.set(title, existing ?? result._id)
  }

  const postCategoryIds = new Map<string, string>()
  for (const title of [...new Set(posts.map((p) => p.category))]) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = await idForSlug('postCategory', slug)
    const doc = {
      _type: 'postCategory',
      title,
      slug: { _type: 'slug', current: slug },
    }
    const result = (await put(doc, existing)) as { _id: string }
    postCategoryIds.set(title, existing ?? result._id)
  }

  // ---- Projects ------------------------------------------------------------
  const projectIdsBySlug = new Map<string, string>()

  for (const [index, p] of projects.entries()) {
    const existing = await idForSlug('project', p.slug)
    const cover = await figure({ src: p.image, alt: p.alt }, p.title)
    const gallery = (
      await Promise.all(p.gallery.map((g) => figure(g, `${p.title} gallery`)))
    ).filter(Boolean)

    const doc = {
      _type: 'project',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: {
        _type: 'reference',
        _ref: projectCategoryIds.get(p.category) ?? 'missing',
      },
      location: p.location,
      year: p.year,
      scope: p.scope,
      client: p.client,
      featured: index < 4,
      order: (index + 1) * 10,
      headline: p.headline,
      lead: p.lead,
      body: toBlocks(p.body),
      challenge: p.challenge,
      approach: p.approach,
      outcomes: p.outcomes,
      cover,
      emphasis: emphasisFor(p.span, p.ratio),
      gallery: keyed(gallery as object[]),
    }
    const result = (await put(doc, existing)) as { _id: string }
    projectIdsBySlug.set(p.slug, existing ?? result._id)
  }

  // ---- Services ------------------------------------------------------------
  for (const [index, s] of services.entries()) {
    const existing = await idForSlug('service', s.slug)
    const cover = await figure({ src: s.image, alt: s.alt }, s.title)
    const gallery = (
      await Promise.all(s.gallery.map((g) => figure(g, `${s.title} gallery`)))
    ).filter(Boolean)
    const poster = await figure(
      { src: s.video.poster, alt: s.video.caption },
      `${s.title} poster`,
    )

    await put(
      {
        _type: 'service',
        title: s.title,
        slug: { _type: 'slug', current: s.slug },
        line: s.line,
        detail: s.detail,
        scope: s.scope,
        order: (index + 1) * 10,
        headline: s.headline,
        lead: s.lead,
        body: toBlocks(s.body),
        deliverables: keyed(
          s.deliverables.map((d) => ({ _type: 'deliverable', title: d.title, text: d.text })),
        ),
        outcomes: s.outcomes,
        cover,
        gallery: keyed(gallery as object[]),
        atmosphere: {
          _type: 'object',
          poster,
          ...(s.video.src ? { videoUrl: s.video.src } : {}),
          caption: s.video.caption,
        },
      },
      existing,
    )
  }

  // ---- Blog ----------------------------------------------------------------
  for (const p of posts) {
    const existing = await idForSlug('post', p.slug)
    const cover = await figure(p.cover, p.title)
    await put(
      {
        _type: 'post',
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        excerpt: p.excerpt,
        category: { _type: 'reference', _ref: postCategoryIds.get(p.category) ?? 'missing' },
        publishedAt: new Date(p.publishedAt).toISOString(),
        author: { name: p.author.name, role: p.author.role },
        cover,
        body: await blogBodyToPortableText(p.body, p.title),
      },
      existing,
    )
  }

  // ---- Testimonials --------------------------------------------------------
  for (const [index, t] of testimonials.entries()) {
    const existing = await idForField('testimonial', 'author', t.author)
    // Link to a case study where the label names one we actually have.
    const match = projects.find((p) => t.project.toLowerCase().startsWith(p.title.toLowerCase()))
    await put(
      {
        _type: 'testimonial',
        quote: t.quote,
        author: t.author,
        role: t.role,
        projectLabel: t.project,
        ...(match && projectIdsBySlug.get(match.slug)
          ? { project: { _type: 'reference', _ref: projectIdsBySlug.get(match.slug) } }
          : {}),
        // These are written placeholders, not client-approved quotes.
        approved: 'pending',
        order: (index + 1) * 10,
      },
      existing,
    )
  }

  // ---- Hero slides ---------------------------------------------------------
  for (const [index, slide] of heroSlides.entries()) {
    const existing = await idForField('heroSlide', 'internalTitle', slide.id)
    const image = await figure({ src: slide.image, alt: slide.alt }, slide.id)
    await put(
      {
        _type: 'heroSlide',
        internalTitle: slide.id,
        image,
        eyebrow: slide.eyebrow,
        headline: slide.title,
        lead: slide.lead,
        cta: { _type: 'cta', label: slide.cta.label, href: slide.cta.href },
        order: (index + 1) * 10,
      },
      existing,
    )
  }

  // ---- Team ----------------------------------------------------------------
  for (const [index, member] of team.entries()) {
    const existing = await idForField('teamMember', 'name', member.name)
    const portrait = await figure({ src: member.image, alt: member.alt }, member.name)
    await put(
      {
        _type: 'teamMember',
        name: member.name,
        role: member.role,
        bio: member.bio,
        portrait,
        order: (index + 1) * 10,
      },
      existing,
    )
  }

  // ---- Singletons ----------------------------------------------------------
  await put({
    _id: 'siteSettings',
    _type: 'siteSettings',
    legalName: siteConfig.legalName,
    shortName: siteConfig.shortName,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    foundedYear: siteConfig.foundedYear,
    phone: siteConfig.contact.phoneDisplay,
    email: siteConfig.contact.email,
    addressLines: [...siteConfig.contact.addressLines],
    locationLabel: siteConfig.contact.locationLabel,
    hours: siteConfig.contact.hours,
    social: {
      facebook: siteConfig.social.facebook,
      instagram: siteConfig.social.instagram,
      linkedin: siteConfig.social.linkedin,
      x: siteConfig.social.x,
    },
  })

  const whyImage = await figure(
    { src: studioImage.src, alt: studioImage.alt },
    'homepage why image',
  )

  await put({
    _id: 'homePage',
    _type: 'homePage',
    reasons: keyed(
      reasons.map((r) => ({ _type: 'numberedNote', title: r.title, body: r.body })),
    ),
    processSteps: keyed(
      processSteps.map((s) => ({
        _type: 'numberedNote',
        title: s.title,
        body: s.body,
        meta: s.duration,
      })),
    ),
    whyImage,
  })

  const aboutHeroImage = await figure(
    { src: aboutHero.image, alt: aboutHero.alt },
    'about hero',
  )
  const aboutStoryImage = await figure(
    { src: aboutStory.image, alt: aboutStory.alt },
    'about story',
  )

  await put({
    _id: 'aboutPage',
    _type: 'aboutPage',
    eyebrow: aboutHero.eyebrow,
    headline: aboutHero.headline,
    lead: aboutHero.lead,
    heroImage: aboutHeroImage,
    storyTitle: aboutStory.title,
    storyBody: toBlocks(aboutStory.body),
    storyImage: aboutStoryImage,
    timeline: keyed(
      timeline.map((t) => ({ _type: 'milestone', year: t.year, title: t.title, text: t.text })),
    ),
    values: keyed(
      values.map((v) => ({ _type: 'numberedNote', title: v.title, body: v.body })),
    ),
    // Stats are invented placeholders; they stay out until the directors confirm them.
    stats: [],
  })

  console.log(`${'─'.repeat(52)}`)
  console.log(`documents:      ${created.length}`)
  console.log(`images uploaded ${uploaded}, reused ${reused}`)
  if (!WRITE) console.log('\nDry run only. Re-run with --write to apply.')
}

main().catch((error) => {
  console.error('\nSeed failed:', error)
  process.exit(1)
})
