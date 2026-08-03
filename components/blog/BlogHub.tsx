import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { BLUR, unsplash } from '@/lib/images'
import { formatPostDate } from '@/data/blog'
import { getPosts } from '@/sanity/content'

const HUB_HERO = unsplash('photo-1497366754035-f200968a6e72', 2400)

/**
 * Blog index: thesis hero, featured post, even grid of remaining articles.
 */
export async function BlogHub() {
  const posts = await getPosts()
  const [featured, ...rest] = posts

  return (
    <>
      <section data-nav-hero className="relative min-h-[64vh] overflow-hidden bg-ink md:min-h-[68vh]">
        <Image
          src={HUB_HERO}
          alt="Quiet office corridor with glass partitions and soft daylight"
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR}
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/35 to-ink/90"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent to-70%"
          aria-hidden="true"
        />

        <Container className="relative flex min-h-[64vh] flex-col justify-end pb-16 pt-36 md:min-h-[68vh] md:pb-20 md:pt-44">
          <Reveal>
            <p className="text-eyebrow uppercase text-bone/65">Blog</p>
            <h1 className="mt-5 max-w-3xl text-display-xl text-bone">
              Notes from the practice.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-bone/75">
              Design, programme, materials and handover - written the way we run
              projects: clear, accountable, without filler.
            </p>
          </Reveal>
        </Container>
      </section>

      {featured ? (
        <section className="border-b border-line bg-bone py-section">
          <Container>
            <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
              <Reveal className="md:col-span-7">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group relative block aspect-4/3 overflow-hidden bg-sand"
                >
                  <Image
                    src={featured.cover.src}
                    alt={featured.cover.alt}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.035]"
                  />
                </Link>
              </Reveal>

              <Reveal delay={0.08} className="md:col-span-5">
                <p className="text-eyebrow uppercase text-clay">Featured</p>
                <p className="mt-4 text-eyebrow uppercase text-stone/70">
                  {featured.category}
                  <span className="mx-2 text-line" aria-hidden="true">
                    ·
                  </span>
                  {formatPostDate(featured.publishedAt)}
                </p>
                <h2 className="mt-4 text-display-lg text-ink">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="transition-colors duration-300 hover:text-clay"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone">{featured.excerpt}</p>
                <p className="mt-4 text-sm text-stone/70">
                  {featured.readingMinutes} min read
                  <span className="mx-2 text-line" aria-hidden="true">
                    ·
                  </span>
                  {featured.author.name}
                </p>
                <ArrowLink href={`/blog/${featured.slug}`} className="mt-8" tone="clay">
                  Read article
                </ArrowLink>
              </Reveal>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-line bg-sand/35 py-section">
        <Container>
          <SectionHead
            index="01"
            title="All articles"
            standfirst="Practical notes from design, contracting and project management."
          />

          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-20">
            {rest.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.06}>
                <article className="group flex h-full flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block aspect-4/3 overflow-hidden bg-sand"
                  >
                    <Image
                      src={post.cover.src}
                      alt={post.cover.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.035]"
                    />
                  </Link>

                  <div className="mt-5 flex flex-1 flex-col border-t border-line pt-5">
                    <p className="text-eyebrow uppercase text-stone/70">
                      {post.category}
                      <span className="mx-2 text-line" aria-hidden="true">
                        ·
                      </span>
                      {formatPostDate(post.publishedAt)}
                    </p>
                    <h3 className="mt-3 text-display-sm text-ink transition-colors duration-300 group-hover:text-clay">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone">{post.excerpt}</p>
                    <p className="mt-auto pt-4 text-xs uppercase tracking-[0.14em] text-stone/65">
                      {post.readingMinutes} min read
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bone py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Have a brief in mind?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                Reading is useful. A conversation about your site is better. Tell us
                where you are building and what you need from the space.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-4 md:col-start-9">
              <ArrowLink href="/contact">Start a project</ArrowLink>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
