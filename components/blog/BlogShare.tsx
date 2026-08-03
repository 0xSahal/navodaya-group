'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/site-config'

/**
 * CMS-style share row: copy link + open share intents for X, LinkedIn, Facebook.
 */
export function BlogShare({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)

  function getUrl() {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${slug}`
    }
    return `${siteConfig.url}/blog/${slug}`
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const shareUrl = encodeURIComponent(`${siteConfig.url}/blog/${slug}`)
  const shareTitle = encodeURIComponent(title)

  const links = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
  ]

  return (
    <div>
      <p className="text-eyebrow uppercase text-clay">Share</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
        <button
          type="button"
          onClick={copyLink}
          className="cursor-pointer text-sm text-stone transition-colors duration-300 hover:text-ink"
        >
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone transition-colors duration-300 hover:text-ink"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
