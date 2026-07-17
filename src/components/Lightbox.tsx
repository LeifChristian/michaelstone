import { useEffect, useEffectEvent, useRef } from 'react'
import type { GalleryImage } from '../config/gallery'
import { MediaImage } from './MediaImage'

type LightboxProps = {
  images: GalleryImage[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
}

export function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const touchStartX = useRef<number | null>(null)
  const image = images[index]

  const go = useEffectEvent((next: number) => {
    if (!images.length) return
    const wrapped = (next + images.length) % images.length
    onChange(wrapped)
  })

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(index + 1)
      if (event.key === 'ArrowLeft') go(index - 1)
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [go, index, onClose])

  if (!image) return null

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>

      <button
        type="button"
        className="lightbox-nav lightbox-prev"
        onClick={(e) => {
          e.stopPropagation()
          go(index - 1)
        }}
        aria-label="Previous photo"
      >
        ‹
      </button>

      <figure
        className="lightbox-figure"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current
          const end = e.changedTouches[0]?.clientX
          touchStartX.current = null
          if (start == null || end == null) return
          const delta = end - start
          if (Math.abs(delta) < 48) return
          go(delta < 0 ? index + 1 : index - 1)
        }}
      >
        <MediaImage
          src={image.src}
          alt={image.alt}
          className="lightbox-image"
          loading="eager"
        />
        {(image.caption || image.alt) && (
          <figcaption>
            {image.caption ?? image.alt}
            <span className="lightbox-count">
              {index + 1} / {images.length}
            </span>
          </figcaption>
        )}
      </figure>

      <button
        type="button"
        className="lightbox-nav lightbox-next"
        onClick={(e) => {
          e.stopPropagation()
          go(index + 1)
        }}
        aria-label="Next photo"
      >
        ›
      </button>
    </div>
  )
}
