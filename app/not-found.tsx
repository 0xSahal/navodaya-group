import type { Metadata } from 'next'
import { NotFoundPage } from '@/components/NotFoundPage'

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'This page is not on the drawings. Return home or continue to projects, services or contact.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return <NotFoundPage />
}
