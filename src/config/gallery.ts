import { generatedGalleryImages } from './media.generated'

export type GalleryImage = {
  id: string
  src: string
  alt: string
  caption?: string
}

/**
 * Photos are auto-discovered from public/images.
 * Name them like: 01-beach.jpg, 02-studio.jpg (natural sort).
 * hero.jpg / cover.jpg / portrait.jpg are reserved for the homepage hero.
 */
export const galleryImages: GalleryImage[] = generatedGalleryImages
