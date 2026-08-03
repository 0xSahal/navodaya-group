# Navodaya Design and Contract

Marketing site for **Navodaya Design and Contract Pvt Ltd**, an interior and architecture
design, contracting and project management firm in New Delhi.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Sanity · Resend

## Running it

```bash
npm install
npm run dev          # http://localhost:3400
```

```bash
npm run build
npm run lint
npx tsc --noEmit
```

Copy `.env.example` to `.env.local` and fill it in. The site needs the Sanity project id
and dataset to render content, and the Resend keys for the forms to send.

The Sanity Studio is a **separate project** in the sibling folder `../navodaya-studio`:

```bash
cd ../navodaya-studio
npm run dev          # http://localhost:3333
npm run deploy       # publishes to sanity.studio
```

## Documentation

| Document | Covers |
| --- | --- |
| **[CLAUDE.md](CLAUDE.md)** | Start here. Architecture, design system, conventions, and the traps worth knowing before changing anything |
| **[CMS.md](CMS.md)** | What is editable in Sanity, caching and revalidation, re-seeding |
| **[FORMS.md](FORMS.md)** | Resend setup, spam handling, rate limiting, failure behaviour |

## Where content lives

**Sanity is the source of truth.** The site reads it through `sanity/content.ts`, which is
the only CMS surface components touch.

The arrays in `data/*.ts` are **not live content**. They survive only for the exported
types and for `scripts/seed-sanity.ts`, which populated Sanity from them. Editing those
arrays changes nothing on the page.

Section titles, section intros and per-page SEO are deliberately still in code.

## Before this goes live

- **Testimonials are unapproved placeholders.** Each carries an "Approval on file" flag,
  currently *not approved*, and shows a ⚠ in the Studio. No named quote publishes without
  written client approval.
- **Company figures are empty on purpose.** The earlier numbers were invented and were not
  migrated. Only directors' confirmed figures go in About page → Values & figures.
- **Milestones and team members are placeholders.** Confirm every date and every name.
- **Around 30 Unsplash images remain** across services, about, blog and the decorative
  page heroes. They sit in the CMS as real assets, so replacing one is drag-and-drop.
- **Deploy, then point the Sanity webhook at the live URL** so published edits appear in
  seconds rather than within the hour. See CMS.md.
- **Set the environment variables in Vercel.** The deployment has its own copy; a value in
  `.env.local` does nothing for the live site.

## Credits

Designed and built by [Sharp Builder](https://sahalshaikh.com/).
