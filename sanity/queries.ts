import { defineQuery } from 'next-sanity'

/*
 * Figure objects are projected whole (`cover`, `gallery[]`) because
 * @sanity/image-url needs the raw `asset._ref` to build a CDN URL. Projecting
 * individual fields off them would break the builder.
 */

const PROJECT_CARD = `
  "id": _id,
  "slug": slug.current,
  title,
  "category": category->title,
  location,
  year,
  scope,
  client,
  emphasis,
  cover
`

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc, year desc) {
    ${PROJECT_CARD}
  }
`)

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc, year desc) {
    ${PROJECT_CARD}
  }
`)

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_CARD},
    headline,
    lead,
    body,
    challenge,
    approach,
    outcomes,
    gallery[]
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`)

export const PROJECT_CATEGORIES_QUERY = defineQuery(`
  *[_type == "projectCategory"] | order(order asc) { title }
`)

const SERVICE_CARD = `
  "id": _id,
  "slug": slug.current,
  title,
  line,
  detail,
  scope,
  order,
  cover
`

export const ALL_SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(order asc) {
    ${SERVICE_CARD}
  }
`)

/*
 * Returns the full service plus the slug order, because the 01/02/03 numbering
 * is derived from position. Fetching the document alone would leave the detail
 * page with no way to know which number it is.
 */
export const SERVICE_BY_SLUG_QUERY = defineQuery(`
  {
    "service": *[_type == "service" && slug.current == $slug][0] {
      ${SERVICE_CARD},
      headline,
      lead,
      body,
      deliverables[]{ title, text },
      outcomes,
      gallery[],
      atmosphere{ poster, videoUrl, caption }
    },
    "slugOrder": *[_type == "service"] | order(order asc).slug.current
  }
`)

export const SERVICE_SLUGS_QUERY = defineQuery(`
  *[_type == "service" && defined(slug.current)].slug.current
`)

const POST_CARD = `
  "slug": slug.current,
  title,
  excerpt,
  "category": category->title,
  publishedAt,
  author,
  cover
`

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    ${POST_CARD}
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_CARD},
    body[]
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`)

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(order asc) {
    "id": _id,
    quote,
    author,
    role,
    "project": coalesce(projectLabel, project->title),
    approved
  }
`)

export const HERO_SLIDES_QUERY = defineQuery(`
  *[_type == "heroSlide"] | order(order asc) {
    "id": coalesce(internalTitle, _id),
    image,
    eyebrow,
    headline,
    lead,
    cta
  }
`)

export const TEAM_QUERY = defineQuery(`
  *[_type == "teamMember"] | order(order asc) {
    name,
    role,
    bio,
    portrait
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    legalName,
    shortName,
    tagline,
    description,
    foundedYear,
    phone,
    whatsapp,
    email,
    addressLines,
    locationLabel,
    hours,
    social
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0] {
    reasons[]{ _key, title, body },
    processSteps[]{ _key, title, body, meta },
    whyImage
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "aboutPage"][0] {
    eyebrow,
    headline,
    lead,
    heroImage,
    storyTitle,
    storyBody,
    storyImage,
    timeline[]{ _key, year, title, text },
    values[]{ _key, title, body },
    stats[]{ _key, value, label }
  }
`)
