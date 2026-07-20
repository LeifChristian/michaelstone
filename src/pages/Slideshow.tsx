import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { MediaImage } from '../components/MediaImage'
import { galleryImages } from '../config/gallery'

const SLIDE_MS = 5000

export function Slideshow() {
  const rootRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  const total = galleryImages.length
  const image = galleryImages[index]
  const nextImage = total ? galleryImages[(index + 1) % total] : null

  const go = useEffectEvent((delta: number) => {
    if (!total) return
    setIndex((current) => (current + delta + total) % total)
  })

  useEffect(() => {
    if (!playing || total < 2) return
    const id = window.setInterval(() => go(1), SLIDE_MS)
    return () => window.clearInterval(id)
  }, [playing, total, go, index])

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const toggleFullscreen = useEffectEvent(async () => {
    const node = rootRef.current
    if (!node) return
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await node.requestFullscreen()
      }
    } catch {
      /* fullscreen blocked or unavailable */
    }
  })

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === ' ') {
        event.preventDefault()
        setPlaying((value) => !value)
      }
      if (event.key === 'f' || event.key === 'F') {
        void toggleFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, toggleFullscreen])

  if (!total || !image) {
    return (
      <section className="slideshow-page">
        <p className="slideshow-empty">No photographs yet.</p>
      </section>
    )
  }

  return (
    <section
      ref={rootRef}
      className={`slideshow-page${fullscreen ? ' is-fullscreen' : ''}`}
      aria-label="Photo slideshow"
    >
      <div className="slideshow-stage">
        <MediaImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          className="slideshow-image"
          loading="eager"
        />
        {nextImage ? (
          <img src={nextImage.src} alt="" className="slideshow-preload" aria-hidden="true" />
        ) : null}
      </div>

      <div className="slideshow-chrome">
        <p className="slideshow-count">
          {index + 1} / {total}
        </p>

        <div className="slideshow-controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo">
            ‹
          </button>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
          >
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo">
            ›
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
        </div>

        <div className="slideshow-progress" aria-hidden="true">
          <span
            key={`${image.id}-${playing}`}
            className={`slideshow-progress-bar${playing ? ' is-running' : ''}`}
            style={{ animationDuration: `${SLIDE_MS}ms` }}
          />
        </div>
      </div>
    </section>
  )
}
