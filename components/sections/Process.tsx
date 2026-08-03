import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { getHomePage } from '@/sanity/content'

/**
 * Four steps, no imagery. Quiet ink band between image-heavy sections.
 */
export async function Process() {
  const { processSteps } = await getHomePage()
  if (processSteps.length === 0) return null

  return (
    <section id="process" className="border-t border-ink-mute bg-ink py-section text-bone">
      <Container>
        <SectionHead
          index="04"
          tone="dark"
          title="How a project runs"
          standfirst="One team from the first site visit to the final snag. You get the same project lead throughout, and one number to call."
        />

        <Reveal>
          <ol className="mt-20 grid gap-x-8 gap-y-12 md:grid-cols-4 md:mt-24">
            {processSteps.map((step) => (
              <li key={step.index} className="relative pt-8">
                <span className="absolute inset-x-0 top-0 h-px bg-ink-mute" aria-hidden="true" />
                <span
                  className="absolute left-0 top-0 h-px w-8 bg-clay-light"
                  aria-hidden="true"
                />

                <span className="text-eyebrow uppercase tabular-nums text-clay-light">
                  {step.index}
                </span>

                <h3 className="mt-5 text-display-sm text-bone">{step.title}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-sand/45">
                  {step.duration}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-sand/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  )
}
