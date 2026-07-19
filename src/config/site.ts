import { generatedHeroImage } from './media.generated'

export const site = {
  name: 'Michael Stone',
  title: 'Michael Stone',
  subtitle: 'January 18, 1951 – 2026',
  description:
    'Michael Eugene Stone was a poet, musician, and friend whose presence left a lasting impression on everyone who knew him.',
  url: 'https://michaelstonepoet.com',
  /** Prefer public/images/hero.jpg — falls back to first gallery image */
  heroImage: generatedHeroImage ?? '/images/hero.jpg',
  heroAlt: 'Portrait of Michael Stone',
  shareText: 'Remembering Michael Stone',
  /** Set to false to hide all download buttons from the music player */
  allowDownloads: true,
} as const
