'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Full-bleed atmosphere band. Prefers a muted autoplay loop when `src` is set;
 * otherwise shows the poster as a still. Reduced motion always pauses video.
 */
export function ServiceVideo({
  src,
  poster,
  caption,
}: {
  src?: string
  poster: string
  caption: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !src) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      node.pause()
      node.removeAttribute('autoplay')
      return
    }

    const play = () => {
      void node.play().catch(() => {
        /* Autoplay can still be blocked; poster remains. */
      })
    }

    play()
  }, [src])

  return (
    <div className="relative">
      <div className="relative aspect-video max-h-[80vh] min-h-[420px] w-full overflow-hidden bg-ink">
        {src ? (
          <video
            ref={ref}
            className="h-full w-full object-cover object-center"
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={caption}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={poster}
            alt={caption}
            fill
            quality={100}
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-ink/15" aria-hidden="true" />
      </div>

      <Container className="absolute inset-x-0 bottom-0 pb-8 md:pb-10">
        <Reveal y={12}>
          <p className="max-w-md text-sm text-bone/80">{caption}</p>
        </Reveal>
      </Container>
    </div>
  )
}
