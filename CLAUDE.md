# Navodaya Design and Contract

Marketing site for **Navodaya Design and Contract Pvt Ltd**, an interior and architecture
design, contracting and project management firm in New Delhi. Everything on the page sells
one idea: they design it *and* they build it, and all three practices carry equal weight.

Live content comes from Sanity. Forms send email through Resend.

```bash
npm run dev      # http://localhost:3400
npm run build
npm run lint
npx tsc --noEmit
```

## ⚠️ Read these first

1. **`data/*.ts` is not live content.** Sanity is the source of truth; the site reads it
   through `sanity/content.ts`. Those files survive only for the exported *types* and for
   `scripts/seed-sanity.ts`. Editing the arrays changes nothing on the page.
2. **Never ship fabricated proof.** The testimonials, the about-page milestones and the
   team members are placeholders written during the build. Testimonials carry an
   "Approval on file" flag, all currently *not approved*, and show a ⚠ in the Studio list.
   No named quote goes live without written client approval.
3. **The stats are deliberately empty.** The old figures (240+ projects, 1.8M sq ft, 35
   staff) were invented, so they were not migrated. The field exists in `aboutPage`; only
   the directors' confirmed numbers go in it.
4. **Never add a universal `* { margin:0; padding:0 }` reset to `globals.css`.** Tailwind
   v4 keeps utilities in `@layer`, and an unlayered universal rule outranks every spacing
   utility site-wide.
5. **Author source in straight ASCII quotes.** Curly punctuation pasted into `.ts`/`.tsx`
   breaks the parser. For strings containing an apostrophe use double quotes.
6. **No em dashes in site copy.** Recast with a period, comma, colon, parentheses or a
   hyphen. Applies to CMS copy and JSX text, not to internal docs like this one.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 (JS config via
`@config`) · framer-motion · Lenis · lucide-react · Sanity · Resend.

## Structure

```
app/
  page.tsx                  homepage, composes the sections
  about|contact|blog|projects|services|vendors-register/
  blog/[slug]  projects/[slug]  services/[slug]
  api/contact  api/vendor-register  api/revalidate
components/
  brand/      Logo.tsx + generated logo-geometry.ts
  sections/   homepage bands (Hero, Services, Projects, Why, Process, Testimonials, Contact)
  projects/ services/ blog/ about/ contact/ vendors/   page-level components
  layout/     Header, Footer
  providers/  IntroProvider, LenisProvider
  ui/         Container, SectionHead, Reveal, ArrowLink
sanity/       client, queries, image, content   ← the only CMS surface components touch
data/         types + seed source only (see rule 1)
lib/          site-config, email, form-validation, lead-validation, lead-route, images
scripts/      one-off generators and maintenance tools
```

The Studio is a **separate project** in the sibling folder `../navodaya-studio`, deployed
to Sanity hosting. Edit schema there.

## Detailed docs

- **`CMS.md`** - what is editable, how caching and revalidation work, re-seeding
- **`FORMS.md`** - Resend setup, spam handling, rate limiting, failure behaviour

## Content (Sanity, project `xhkjrv4q`, dataset `production`)

Eight collections (`project`, `service`, `post`, `testimonial`, `teamMember`, `heroSlide`,
`projectCategory`, `postCategory`) and three singletons (`siteSettings`, `homePage`,
`aboutPage`).

`sanity/content.ts` is the seam: it returns the same shapes components used when content
was hard-coded, which is why the CMS swap barely touched any JSX. **Components import from
there and nowhere else.**

Things derived on the frontend so an editor cannot get them wrong:

- `01`, `02`, `03` numbering follows document or array order
- reading time is counted from the post body
- `tel:` and `wa.me` links are derived from the single phone field
- projects expose **wide / standard / tall**, which the frontend maps onto safe
  column-span and aspect-ratio pairs, so the asymmetric grid cannot be broken from the CMS

Plain-prose fields (project body, service body, about story) have bold, links and headings
**disabled at schema level**, because the templates render them flat and formatting
entered there would silently vanish.

**Detail pages must use their by-slug query.** `getService()` once read through
`getServices()`, which uses the card projection, and the service pages rendered as empty
bands because headline, lead, body, deliverables and outcomes were never fetched. If a
detail page looks half-empty, check the projection first.

Reads are tagged `sanity` with an hourly fallback; the webhook at `POST /api/revalidate`
drops the tag on publish. Deliberately **not** `defineLive`/`sanityFetch` - that pins every
request to `revalidate: false` and needs `<SanityLive />` mounted, or content freezes at
build time.

## Forms

Two routes, both sending through Resend: `POST /api/contact` and `POST /api/vendor-register`.
Each submission emails the studio *and* acknowledges the sender.

- Server-side validation reuses the **same validators** the browser uses
  (`lib/form-validation.ts`), so the two cannot drift. Pass the *same* `required` argument
  on both sides: the server once validated `location` as required while the UI labelled it
  Optional, and every enquiry that left the city blank died with a 422.
- Spam: an off-screen honeypot, a minimum fill time, and link-stuffing detection. A trip
  returns a normal-looking `200` with no email, so a bot learns nothing.

### The honeypot must stay invisible to autofill

The honeypot field was called `company_website`, labelled "Company website". Chrome autofill
and every password manager recognised that as a profile field and filled it, so **genuine
enquiries were silently discarded as bots** - the visitor got the thank-you screen and the
enquiry reached nobody. It is now `nd_ref`, labelled "Reference", carrying
`data-1p-ignore` / `data-lpignore` / `data-bwignore` / `data-form-type="other"`.
`autoComplete="off"` alone is **not** enough; Chrome has ignored it for profile data for
years. Never give this field a name or label that maps to an autofill category (website,
company, address, organisation, url...). `resetForm()` must clear it too, or one autofill
poisons every later submission in the session.

**Diagnosing "the form submits but no email arrives".** A spam discard and a real send both
return `200`, which makes a false positive invisible from the browser. Distinguish them:

- Success is `{ ok: true, acknowledged: true }`; a discard has **no `acknowledged` key**, and
  in development carries `devDiscarded: "<reason>"`.
- A discard is also suspiciously *fast*, because it never waits on Resend.
- The dev server logs every one: `grep "discarded as spam" .next/dev/logs/next-development.log`
- Ground truth is Resend itself. `GET https://api.resend.com/emails` lists what was actually
  accepted. **Zero records for a submission means the request never reached `send()`** - the
  problem is in the route, not in email delivery.
- Rate limit: five *delivered* submissions per IP per 10 minutes. Only successful sends
  count - counting rejected ones locks out someone making validation mistakes.
- **Failures are never disguised as success.** If the studio notification does not go out
  the enquiry reached nobody, so the visitor gets an error and the phone number rather
  than a thank-you screen.

Email templates live in `lib/email.ts`. Preview them without sending:

```bash
npx tsx scripts/preview-email.ts email-preview
```

## Design system

All tokens live in `tailwind.config.ts`. Components must not hardcode a hex, radius or
shadow.

- **Palette is three notes.** Warm charcoal (`ink`), warm paper (`bone` / `sand`), one
  accent (`clay`, a muted terracotta). No second accent, no gradients on surfaces. The
  only gradients are the hero scrims.
- **Type**: Instrument Serif for display, Instrument Sans for everything else.
- **Radii near zero** (`tight` 1px, `card` 2px). Architecture reads as square.
- **One shadow** (`lift`), hover only, never at rest.
- **Motion is restrained.** The hero earns a real entrance; everywhere else is a single
  rise-and-fade via `Reveal`.

### Layout notes worth keeping

- **Section headings are numbered, not kicker-labelled.** `SectionHead` puts a `01`
  against a hairline rule instead of the uppercase eyebrow every template uses.
- **Services get three identical columns.** Equal space is the argument: the firm is
  routinely mistaken for an interiors-only practice.
- **Testimonials are purely typographic.** No stock headshots - borrowed faces beside a
  client quote are the fastest way to make a real firm look invented.
- **The WhatsApp FAB hides over the contact section**, which has its own WhatsApp button;
  on a phone the two overlap.

### The fixed header and the space under it

The header is `position: fixed`, so a page that does not open with a full-bleed dark
hero has to reserve its height or the content starts underneath it.

**That reservation is CSS, in `globals.css`, keyed off the hero's own marker:**

```css
main { padding-top: var(--header-h); }
main:has([data-nav-hero]) { padding-top: 0; }
```

It used to be a spacer `<div>` rendered by `Header` whenever a *pathname whitelist*
(`pageHasNavHero`) said the route had no hero. That is a client-side guess about what the
server rendered, and the two could disagree: any render where `usePathname()` was not the
real route put a 7.75rem spacer on the homepage, pushing the hero down and leaving the
transparent header (cream nav labels, translucent utility bar) sitting over white page
background instead of over the photograph. It showed up after a Sanity publish and went
away on redeploy, which made it look like a caching bug rather than a rendering one.

`data-nav-hero` is in the server-rendered HTML, so the space and the hero can no longer
disagree. **Do not reintroduce a JS-rendered spacer.** Every hero page already sets the
marker; a new full-bleed page only has to set it too.

`pageHasNavHero` still exists, but only picks the header's *tone* (transparent vs solid).
Getting that wrong is cosmetic and self-corrects on scroll; getting the layout wrong was not.
The scroll effect **re-queries `[data-nav-hero]` on every scroll rather than capturing it
once** - during a client-side navigation the effect can run before the incoming page's hero
has committed, and a captured `null` leaves the header stuck solid on a page that has a hero.

### The intro sequence

`IntroProvider` → `SplashScreen` is the opening curtain and owns the page's starting gun.

- Built as a **drawing title block**, not a spinner: the logo lockup rises out of a mask, a
  hairline draws under it in the accent, and a counter runs up in the corner.
- **`onReveal` fires as the curtain starts lifting, not after**, so the hero's clip-wipe
  plays through the last of the lift and the two read as one move. `REVEAL_AT` is
  `EXIT_AT` plus the curtain's own delay - keep them in step if you retime anything.
- Two flags: `useIntroReady()` (curtain lifting) gates the hero; `useIntroFinished()`
  (curtain gone) gates anything that scrolls.
- **Lenis must not run during the intro.** It turns wheel events into *programmatic*
  scrolls, and `overflow: hidden` only blocks *user* scrolling - so with Lenis mounted a
  single wheel gesture drags the page behind the curtain. `LenisProvider` waits on
  `useIntroFinished()`, which is why `IntroProvider` is the outer of the two in
  `app/layout.tsx`.
- The scroll lock sets `overflow: hidden` on **both `html` and `body`**; `html` is the
  scrolling element and body-to-viewport propagation does not hold once Lenis mounts.
- A reload would otherwise restore mid-page scroll behind the curtain, so `IntroProvider`
  sets `scrollRestoration = 'manual'` and resets to the top.
- **Reduced motion skips the splash entirely.**

## Brand assets

The logo was recreated as vector from the client's own PDF (`scripts/navodaya-logo-source.pdf`).
Geometry is generated, not hand-drawn - **do not hand-edit `components/brand/logo-geometry.ts`**:

```bash
python scripts/extract-logo.py          # PDF  -> scripts/extracted.json
python scripts/build-logo-geometry.py   # json -> components/brand/logo-geometry.ts
```

Only the colour changed from the original: the client's blue became the site's clay. The
design is otherwise untouched, which was a condition of using it.

`Logo.tsx` serves three variants from one coordinate space, switched by viewBox:

- `lockup` - mark + wordmark + strapline. Needs room; used in the footer and splash.
- `stacked` - mark + wordmark. The small-size lockup.
- `mark` - the building alone. Used in the header beside the name.

**The header uses mark + type, not the full lockup.** The supplied logo is a stacked
lockup whose wordmark is a sixth of its height, so at any size fitting a header the name
renders around 6px and reads as a smudge.

Other generators:

```bash
python scripts/export-logo-svg.py public/brand    # standalone SVGs for handover
python scripts/generate-icons.py out              # favicon set
python scripts/generate-email-logo.py public/brand # PNG for email
```

**Favicons are an apex crop of the mark, not the whole logo.** The full mark has six thin
bands and turns to mush below about 48px. Every size is rendered natively rather than
downscaled from one master.

Two things that will waste an hour if forgotten when using these scripts: **Chrome
enforces a minimum window size**, so small tiles must be rendered large and resampled
down; and **`--screenshot` resolves against Chrome's working directory**, so the path must
be absolute.

## Environment

`.env.local`, and the same set in Vercel:

```
NEXT_PUBLIC_SANITY_PROJECT_ID   xhkjrv4q
NEXT_PUBLIC_SANITY_DATASET      production
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_WRITE_TOKEN          seeding only, never NEXT_PUBLIC
SANITY_REVALIDATE_SECRET        shared with the Sanity webhook
RESEND_API_KEY
CONTACT_EMAIL                   where enquiries land
RESEND_FROM                     verified-domain sender
MONGODB_URI                     Atlas URI for form lead persistence
```

The site reads the public dataset without a token; only the seed script needs write access.
Form leads are written to MongoDB (`navodaya.leads`) after a successful email send
via `lib/leads.ts`.

## Still to do

- Deploy to `navodayagroup.com` and point the Sanity webhook at it
- Move rate limiting to shared storage
- Replace the remaining Unsplash placeholders across services, about, blog and the
  decorative page heroes on `/contact`, `/blog` and `/vendors-register`
- Real stats, real milestones, real team, approved testimonials
