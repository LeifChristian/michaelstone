import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { GalleryImage } from '../config/gallery'
import { site } from '../config/site'
import { MediaImage } from './MediaImage'

type LightboxProps = {
  images: GalleryImage[]
  index: number
  onClose: () => void
  onChange: (index: number) => void
}

function filenameFromSrc(src: string, fallback: string) {
  const base = src.split('/').pop()?.split('?')[0]
  if (base && base.includes('.')) return base
  return `${fallback.replace(/\s+/g, '-').toLowerCase() || 'photo'}.jpg`
}

async function downloadPhoto(src: string, filename: string) {
  try {
    const res = await fetch(src)
    if (!res.ok) throw new Error('fetch failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch {
    const a = document.createElement('a')
    a.href = src
    a.download = filename
    a.target = '_blank'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}

export function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const touchStartX = useRef<number | null>(null)
  const [downloading, setDownloading] = useState(false)
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

  const filename = filenameFromSrc(image.src, image.alt || image.id)

  const handleDownload = async (event: MouseEvent) => {
    event.stopPropagation()
    if (downloading) return
    setDownloading(true)
    try {
      await downloadPhoto(image.src, filename)
    } finally {
      setDownloading(false)
    }
  }

  return createPortal(
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
        <figcaption className="lightbox-caption">
          <div className="lightbox-caption-text">
            <span>{image.caption ?? image.alt}</span>
            <span className="lightbox-count">
              {index + 1} / {images.length}
            </span>
          </div>
          {site.allowDownloads ? (
            <button
              type="button"
              className="lightbox-download"
              onClick={handleDownload}
              disabled={downloading}
              aria-label={`Download ${filename}`}
            >
              <DownloadIcon />
              <span>{downloading ? 'Saving…' : 'Download'}</span>
            </button>
          ) : null}
        </figcaption>
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
    </div>,
    document.body,
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11 4h2v8.2l2.6-2.6 1.4 1.4L12 16.4 6.999 11l1.4-1.4L11 12.2V4zm-5 14h12v2H6v-2z"
      />
    </svg>
  )
}
