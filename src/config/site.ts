import { generatedHeroImage } from './media.generated'

export const site = {
  name: 'Michael Stone',
  title: 'Michael Stone',
  subtitle: 'Poet · Musician · Friend',
  description:
    'A quiet memorial for Michael Stone — his music, photographs, and story, kept here so anyone can remember him.',
  url: 'https://michaelstonepoet.com',
  /** Prefer public/images/hero.jpg — falls back to first gallery image */
  heroImage: generatedHeroImage ?? '/images/hero.jpg',
  heroAlt: 'Portrait of Michael Stone',
  shareText: 'Remembering Michael Stone',
} as const
