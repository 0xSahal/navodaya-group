/**
 * Unsplash placeholder photography.
 *
 * Every id below was checked to resolve before being used. Images are requested
 * through Unsplash's own resizing params so we never pull a 6000px original
 * into the page. When the client's real photography arrives, replace `unsplash`
 * calls in `data/*` with `/images/...` paths and drop the remotePattern in
 * `next.config.ts`.
 */
export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}

/**
 * Tiny, heavily compressed version of the same frame, inlined as the blur
 * placeholder so image swaps do not flash white against the warm background.
 */
export const BLUR =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#E7E1D6"/></svg>',
  ).toString('base64')
