# Content management (Sanity)

The site reads all of its content from Sanity project **`xhkjrv4q`**, dataset
**`production`**. The Studio is a separate project in the sibling folder
`../navodaya-studio`.

## Running things

```bash
# The site
npm run dev            # http://localhost:3400

# The Studio (from ../navodaya-studio)
npm run dev            # http://localhost:3333
npm run deploy         # publishes to https://navodaya.sanity.studio
```

`npm run deploy` needs a one-time `npx sanity login` on your machine.

## Where content lives

| In the Studio | Feeds |
| --- | --- |
| Homepage (singleton) | The "why" reasons and process steps on `/` |
| About page (singleton) | Hero, story, milestones, values, figures on `/about` |
| Site settings (singleton) | Seeded in Studio only; not wired to the live site yet (see note) |
| Hero slides | The homepage carousel |
| Projects | `/projects`, `/projects/[slug]`, homepage teaser |
| Services | `/services`, `/services/[slug]`, homepage, **header dropdown**, **footer** |
| Blog posts | `/blog`, `/blog/[slug]` |
| Testimonials | Homepage quote band |
| Team | Leadership on `/about` |
| Configuration → categories | The filter row on `/projects`, blog categories |

**Still in code, by design:** section titles and intros ("Three practices, one
contract"), per-page SEO, the vendor-registration category tree, and the
decorative hero images on `/contact`, `/blog` and `/vendors-register`.

**Site settings are not live.** Phone, email, address, hours and social still
come from `lib/site-config.ts`. Studio edits to the Site settings singleton do
not change the site. `getSiteSettings()` in `sanity/content.ts` is ready for
that cutover when you choose to do it.

## How the code is wired

```
sanity/
  client.ts     the client + the one fetch helper (cache tags, revalidation)
  queries.ts    GROQ, one export per read
  image.ts      CDN URL builder, hotspot-aware
  content.ts    the seam: Sanity documents -> the shapes components already used
```

`sanity/content.ts` is the only module components import. It returns the same
types the site used when content was hard-coded, which is why the migration
barely touched any JSX.

### Caching

Reads are tagged `sanity` with an hourly fallback, and the Sanity webhook at
`POST /api/revalidate` drops that tag on publish, so edits appear within seconds.

This is deliberately **not** `defineLive`/`sanityFetch` from `next-sanity`. That
pins every request to `revalidate: false` and only invalidates through a mounted
`<SanityLive />`; without that component the site silently freezes at build-time
content. Tag-based revalidation has no such trap. If live preview is wanted
later, mount `<SanityLive />` at the same time as switching.

### Webhook setup

Sanity Manage → API → Webhooks → Create webhook:

- **URL** `https://<your-domain>/api/revalidate`
- **Dataset** production
- **Trigger on** create, update, delete
- **Secret** the value of `SANITY_REVALIDATE_SECRET` in `.env.local`

Until that exists, published edits appear within the hour rather than instantly.

## Derived rather than typed

Several things are computed on the frontend so an editor cannot get them wrong:

- **`01`, `02`, `03`** numbering follows document/array order.
- **Reading time** is counted from the post body.
- **`tel:` and `wa.me` links** are derived from the single phone field.
- **Grid layout**: projects expose "wide / standard / tall", which the frontend
  maps onto safe column-span and aspect-ratio pairs. The asymmetric grid cannot
  be broken from the Studio.

Plain-prose fields (project body, service body, about story) have bold, links
and headings disabled at the schema level, because the templates render them as
flat paragraphs — formatting entered there would silently vanish on the page.

## Re-seeding

`scripts/seed-sanity.ts` migrated the original hard-coded content from `data/*.ts`. It is
idempotent: documents are matched by slug and replaced, so a re-run updates
rather than duplicates.

```bash
npx tsx scripts/seed-sanity.ts          # dry run
npx tsx scripts/seed-sanity.ts --write  # apply
```

**It will overwrite Studio edits** for any document whose slug it recognises.
Once the client starts editing, treat it as a one-time tool.

The arrays in `data/*.ts` exist only to feed that script and to export the types
the components use. Editing them changes nothing on the site.

## Before launch

- **Testimonials are unapproved placeholders.** Each has an "Approval on file"
  field, all currently set to *not approved*, and the Studio list marks them
  with a ⚠. Do not publish a named quote without written client approval.
- **Figures are empty on purpose.** The old stats (240+ projects, 1.8M sq ft, 35
  staff) were invented, so they were not migrated. Add real numbers in
  About page → Values & figures.
- **The 2005–2024 milestones are invented.** Confirm every date.
- **Team members are placeholder names and stock portraits.**
- **Roughly 30 Unsplash images** remain across services, about, blog and the
  decorative page heroes. They are in the CMS as real assets, so replacing one
  is a drag-and-drop in the Studio.
