# SEO

Frontend-only SEO for the Navodaya marketing site. Per-page titles, descriptions
and structured data live in code by design (see `CMS.md`). Sanity schemas are
not extended with SEO fields.

Canonical site URL: `https://www.navodayagroup.com` (`lib/site-config.ts`).

## Executive summary

The App Router Metadata API, a dynamic sitemap, robots.txt, brand icons, a
default Open Graph image, and JSON-LD per page type keep the site crawlable and
eligible for rich results without inventing proof (no review stars until
testimonials are approved).

## Checklist

### Crawl and index

- [x] `app/sitemap.ts` → `/sitemap.xml` (static hubs + Sanity slugs)
- [x] `app/robots.ts` → `/robots.txt` (allows site, disallows `/api/`, points at sitemap)
- [x] Self-referencing canonicals on every indexable page
- [x] 404 is `noindex, follow`
- [x] AI search bots not blocked (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [x] `public/llms.txt` for agent-readable firm summary

### On-page

- [x] Unique title + meta description per route
- [x] Root default title/keywords target New Delhi / NCR (not Gujarat)
- [x] Title template `%s | Navodaya Design and Contract`
- [x] `html lang="en"`, `metadataBase` set
- [x] Optional Google Search Console verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

### Social

- [x] Open Graph (type, locale `en_IN`, url, siteName, title, description, images)
- [x] Twitter `summary_large_image` aligned with OG
- [x] Default branded OG image (`app/opengraph-image.tsx`) for hubs without a cover
- [x] Detail pages use CMS cover images when present

### Icons and PWA chrome

- [x] `app/icon.png` (browser tab / Google favicon candidate)
- [x] `app/apple-icon.png`
- [x] `public/favicon.ico`
- [x] `app/manifest.ts` → web app manifest

### Structured data (JSON-LD)

| Route | Schema |
| --- | --- |
| `/` | `@graph`: Organization, WebSite, ProfessionalService |
| `/about` | Organization + WebPage + BreadcrumbList |
| `/contact` | ProfessionalService + ContactPage + BreadcrumbList |
| `/services` | CollectionPage + BreadcrumbList |
| `/services/[slug]` | Service + BreadcrumbList |
| `/projects` | CollectionPage + BreadcrumbList |
| `/projects/[slug]` | CreativeWork + BreadcrumbList |
| `/blog` | CollectionPage + BreadcrumbList |
| `/blog/[slug]` | BlogPosting + BreadcrumbList |
| `/vendors-register` | WebPage + BreadcrumbList |

No `AggregateRating` / `Review` markup until client quotes are approved.

## Code map

```
lib/seo.ts                 absoluteUrl, truncate, buildPageMetadata
lib/schema.ts              JSON-LD builders from siteConfig + page props
components/seo/JsonLd.tsx  SSR <script type="application/ld+json">
app/sitemap.ts
app/robots.ts
app/manifest.ts
app/opengraph-image.tsx
app/twitter-image.tsx
public/llms.txt
public/favicon.ico
app/icon.png
app/apple-icon.png
```

## Page matrix

| Path | Title source | Description source | OG image |
| --- | --- | --- | --- |
| `/` | `buildPageMetadata` / layout default | `siteConfig.description` | default OG |
| `/about` … `/vendors-register` | static string | static + `siteConfig` | default OG |
| `/projects/[slug]` | `project.title` | `project.lead` | cover |
| `/services/[slug]` | `service.title` | line + detail | cover |
| `/blog/[slug]` | `post.title` | `post.excerpt` | cover |

## Verification

```bash
npm run dev   # http://localhost:3400
# Then open:
#   /sitemap.xml
#   /robots.txt
#   /manifest.webmanifest
#   /favicon.ico
#   /icon.png
# View-source on /, a service, a project and a blog post:
#   <title>, <link rel="canonical">, og:*, twitter:*, application/ld+json
```

External checks after deploy:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- Submit sitemap in Google Search Console and Bing Webmaster Tools

## Environment

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION   optional, GSC meta tag content
```

Site URL stays in `siteConfig.url` (not env) so preview deploys do not rewrite
canonicals to Vercel hostnames.

## Out of scope / later

- Search Console / Bing property ownership and sitemap submission
- Privacy and terms pages
- Sanity SEO override fields (`metaTitle`, `ogImage`) if editors need them
- Review rich results (blocked until testimonials carry written approval)
- Core Web Vitals tuning beyond existing image/font setup

## Regenerating icons

```bash
pip install pillow
python scripts/generate-icons.py out
# copy out/icon.png and out/apple-icon.png → app/
# copy out/favicon.ico → public/
```

Icons are an apex crop of the mark (see `CLAUDE.md`), not the full lockup.
