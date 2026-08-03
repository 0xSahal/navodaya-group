/**
 * Server-rendered JSON-LD. Kept as a plain script tag so crawlers see it in
 * the initial HTML without client hydration.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
