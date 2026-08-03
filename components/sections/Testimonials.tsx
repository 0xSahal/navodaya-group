import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { getTestimonials } from '@/sanity/content'

/**
 * Purely typographic testimonial band.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials()
  if (testimonials.length === 0) return null

  return (
    <section className="border-t border-line py-section">
      <Container>
        <SectionHead
          index="05"
          title="What clients say"
          standfirst="A few notes from people who handed us the brief and the build."
        />

        <Reveal>
          <div className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-3 md:mt-24">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.id}
                className="flex h-full flex-col border-t border-line pt-8"
              >
                <span
                  className="font-display text-4xl leading-none text-clay/60"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-4 flex-1">
                  <p className="text-display-sm leading-snug text-ink">{testimonial.quote}</p>
                </blockquote>

                <figcaption className="mt-8 text-sm">
                  <span className="block text-ink">{testimonial.author}</span>
                  <span className="mt-1 block text-stone">{testimonial.role}</span>
                  <span className="mt-3 block text-eyebrow uppercase text-stone/65">
                    {testimonial.project}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
