import Image from 'next/image'
import type { BlogBlock } from '@/data/blog'

/**
 * Renders structured post blocks. Heading ids power the sticky TOC.
 */
export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 2) {
              return (
                <h2
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="scroll-mt-32 pt-4 font-display text-display-md text-ink"
                >
                  {block.text}
                </h2>
              )
            }
            return (
              <h3
                key={`${block.id}-${index}`}
                id={block.id}
                className="scroll-mt-32 pt-2 font-display text-2xl text-ink"
              >
                {block.text}
              </h3>
            )

          case 'paragraph':
            return (
              <p key={index} className="text-base leading-[1.8] text-stone">
                {block.text}
              </p>
            )

          case 'list': {
            const Tag = block.ordered ? 'ol' : 'ul'
            return (
              <Tag
                key={index}
                className={`space-y-3 text-base leading-[1.8] text-stone ${
                  block.ordered ? 'list-decimal pl-5' : 'list-disc pl-5'
                }`}
              >
                {block.items.map((item) => (
                  <li key={item} className="pl-1">
                    {item}
                  </li>
                ))}
              </Tag>
            )
          }

          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-2 border-clay pl-6 py-1"
              >
                <p className="font-display text-xl leading-relaxed text-ink">
                  {block.text}
                </p>
                {block.cite ? (
                  <cite className="mt-3 block text-eyebrow uppercase not-italic text-stone/70">
                    {block.cite}
                  </cite>
                ) : null}
              </blockquote>
            )

          case 'image':
            return (
              <figure key={index} className="py-2">
                <div className="relative aspect-4/3 overflow-hidden bg-sand">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-3 text-xs leading-relaxed text-stone">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
