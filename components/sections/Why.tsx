import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { getHomePage } from '@/sanity/content'

/**
 * Homepage argument band - three reasons, then the fuller story on `/about`.
 */
export async function Why() {
  const { reasons, whyImage } = await getHomePage()
  if (reasons.length === 0) return null

  return (
    <section id="why" className="border-t border-line bg-bone py-section">
      <Container>
        <SectionHead
          index="03"
          title="Why clients hand us the whole thing"
          standfirst="Splitting design and construction between two firms is where budgets and timelines usually go wrong. Keeping both in one office is the entire point of how we are set up."
        />

        <div className="mt-20 grid gap-x-16 gap-y-14 md:grid-cols-12 md:mt-24">
          {whyImage ? (
            <Reveal className="md:col-span-5">
              <div className="relative aspect-3/4 overflow-hidden bg-sand">
                <Image
                  src={whyImage.src}
                  alt={whyImage.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}

          <div className="md:col-span-6 md:col-start-7">
            <ul>
              {reasons.map((reason, index) => (
                <Reveal key={reason.index} delay={index * 0.06}>
                  <li className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-9 first:border-t-0 first:pt-0">
                    <span className="text-eyebrow uppercase tabular-nums leading-[1.9] text-clay">
                      {reason.index}
                    </span>
                    <h3 className="text-display-sm text-ink">{reason.title}</h3>
                    <p className="col-start-2 mt-4 max-w-prose text-base leading-relaxed text-stone">
                      {reason.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <ArrowLink href="/about" className="mt-10" tone="clay">
                About the studio
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
