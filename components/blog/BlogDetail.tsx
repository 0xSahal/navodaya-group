import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { BlogBody } from '@/components/blog/BlogBody'
import { BlogToc } from '@/components/blog/BlogToc'
import { BlogShare } from '@/components/blog/BlogShare'
import { BLUR } from '@/lib/images'
import { formatPostDate, getTocItems, type BlogPost } from '@/data/blog'
import { getAdjacentPosts, getRelatedPosts } from '@/sanity/content'

/**
 * CMS-style article: cover hero, readable body, sticky TOC + share rail,
 * prev/next, related posts, enquiry.
 */
export async function BlogDetail({ post }: { post: BlogPost }) {
  const toc = getTocItems(post)
  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts(post.slug, 3),
    getAdjacentPosts(post.slug),
  ])

  return (
    <>
      <section className="border-b border-line bg-bone pt-14 pb-12 md:pt-16 md:pb-16">
        <Container>
          <Reveal>
            <nav className="text-eyebrow uppercase text-stone/70" aria-label="Breadcrumb">
              <Link href="/blog" className="transition-colors duration-300 hover:text-ink">
                Blog
              </Link>
              <span className="mx-3 text-line" aria-hidden="true">
                /
              </span>
              <span className="text-stone">{post.category}</span>
            </nav>

            <p className="mt-8 text-eyebrow uppercase text-clay">{post.category}</p>
            <h1 className="mt-4 max-w-3xl text-display-xl text-ink">{post.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-stone">
              <span>
                <span className="text-ink">{post.author.name}</span>
                <span className="mx-2 text-line" aria-hidden="true">
                  ·
                </span>
                {post.author.role}
              </span>
              <span className="tabular-nums">{formatPostDate(post.publishedAt)}</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative mt-12 aspect-4/3 overflow-hidden bg-sand md:aspect-[21/9]">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                fill
                priority
                placeholder="blur"
                blurDataURL={BLUR}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone py-section">
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
            <article className="max-w-prose lg:col-span-8 lg:max-w-none">
              <Reveal>
                <BlogBody blocks={post.body} />
              </Reveal>
            </article>

            <aside className="space-y-12 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <BlogToc items={toc} />
              <BlogShare title={post.title} slug={post.slug} />

              <div>
                <p className="text-eyebrow uppercase text-clay">Article</p>
                <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3.5">
                    <dt className="text-stone/70">Category</dt>
                    <dd className="text-ink">{post.category}</dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3.5">
                    <dt className="text-stone/70">Published</dt>
                    <dd className="tabular-nums text-ink">{formatPostDate(post.publishedAt)}</dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3.5">
                    <dt className="text-stone/70">Author</dt>
                    <dd className="text-ink">{post.author.name}</dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3.5">
                    <dt className="text-stone/70">Read</dt>
                    <dd className="text-ink">{post.readingMinutes} min</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          <div className="mt-20 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group block">
                <p className="text-eyebrow uppercase text-stone/70">Previous</p>
                <p className="mt-3 font-display text-xl text-ink transition-colors duration-300 group-hover:text-clay">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/blog/${next.slug}`} className="group block text-left md:text-right">
                <p className="text-eyebrow uppercase text-stone/70">Next</p>
                <p className="mt-3 font-display text-xl text-ink transition-colors duration-300 group-hover:text-clay">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-b border-line bg-sand/35 py-section">
          <Container>
            <Reveal>
              <h2 className="text-display-md text-ink">Related articles</h2>
              <p className="mt-4 max-w-prose text-sm text-stone">
                More notes in a similar register - or the next piece on the list.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.06}>
                  <Link href={`/blog/${item.slug}`} className="group block">
                    <div className="relative aspect-4/3 overflow-hidden bg-sand">
                      <Image
                        src={item.cover.src}
                        alt={item.cover.alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-5 text-eyebrow uppercase text-clay">{item.category}</p>
                    <h3 className="mt-2 font-display text-2xl text-ink transition-colors duration-300 group-hover:text-clay">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone">
                      {formatPostDate(item.publishedAt)}
                      <span className="mx-2 text-line" aria-hidden="true">
                        ·
                      </span>
                      {item.readingMinutes} min
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-bone py-section">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 className="text-display-lg text-ink">Ready to talk through a brief?</h2>
              <p className="mt-6 max-w-prose text-base text-stone">
                If this article touched something on your site, tell us where you are
                building. We come back within two working days.
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
