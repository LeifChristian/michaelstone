import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from 'react'
import { MediaImage } from '../components/MediaImage'
import { galleryImages } from '../config/gallery'

const SLIDE_MS = 5000
const FADE_MS = 1100
const CHROME_HIDE_MS = 3000
const SLIDESHOW_AUDIO = '/music/03-Road to Redemption Mix.mp3'

export function Slideshow() {
  const rootRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const chromeHideTimer = useRef<number | null>(null)
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [chromeVisible, setChromeVisible] = useState(true)
  /** Start muted so browsers allow autoplay; user can unmute. */
  const [muted, setMuted] = useState(true)
  const [needsGesture, setNeedsGesture] = useState(false)

  const total = galleryImages.length
  const image = galleryImages[index]
  const prevImage = prevIndex != null ? galleryImages[prevIndex] : null
  const nextImage = total ? galleryImages[(index + 1) % total] : null

  const clearChromeTimer = useEffectEvent(() => {
    if (chromeHideTimer.current != null) {
      window.clearTimeout(chromeHideTimer.current)
      chromeHideTimer.current = null
    }
  })

  const scheduleChromeHide = useEffectEvent(() => {
    clearChromeTimer()
    if (!fullscreen) return
    chromeHideTimer.current = window.setTimeout(() => {
      setChromeVisible(false)
      chromeHideTimer.current = null
    }, CHROME_HIDE_MS)
  })

  const revealChrome = useEffectEvent(() => {
    setChromeVisible(true)
    scheduleChromeHide()
  })

  const go = useEffectEvent((delta: number) => {
    if (!total) return
    setIndex((current) => {
      const next = (current + delta + total) % total
      if (next === current) return current
      setPrevIndex(current)
      return next
    })
  })

  const ensureAudioPlaying = useEffectEvent(async (nextMuted: boolean) => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = nextMuted
    audio.loop = true
    try {
      await audio.play()
      setNeedsGesture(false)
    } catch {
      setNeedsGesture(true)
    }
  })

  useEffect(() => {
    if (!playing || total < 2) return
    const id = window.setInterval(() => go(1), SLIDE_MS)
    return () => window.clearInterval(id)
  }, [playing, total, go, index])

  useEffect(() => {
    if (prevIndex == null) return
    const id = window.setTimeout(() => setPrevIndex(null), FADE_MS)
    return () => window.clearTimeout(id)
  }, [prevIndex, index])

  useEffect(() => {
    void ensureAudioPlaying(muted)
    return () => {
      audioRef.current?.pause()
    }
  }, [ensureAudioPlaying, muted])

  useEffect(() => {
    const onFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement)
      setFullscreen(active)
      if (active) {
        setChromeVisible(true)
      } else {
        setChromeVisible(true)
        clearChromeTimer()
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [clearChromeTimer])

  useEffect(() => {
    if (!fullscreen) {
      setChromeVisible(true)
      clearChromeTimer()
      return
    }
    scheduleChromeHide()
    return () => clearChromeTimer()
  }, [fullscreen, clearChromeTimer, scheduleChromeHide])

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

  const toggleMute = useEffectEvent(() => {
    const next = !muted
    setMuted(next)
    void ensureAudioPlaying(next)
  })

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (fullscreen) revealChrome()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === ' ') {
        event.preventDefault()
        setPlaying((value) => !value)
      }
      if (event.key === 'f' || event.key === 'F') {
        void toggleFullscreen()
      }
      if (event.key === 'm' || event.key === 'M') {
        toggleMute()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, toggleFullscreen, toggleMute, fullscreen, revealChrome])

  if (!total || !image) {
    return (
      <section className="slideshow-page">
        <p className="slideshow-empty">No photographs yet.</p>
      </section>
    )
  }

  const chromeHidden = fullscreen && !chromeVisible

  return (
    <section
      ref={rootRef}
      className={[
        'slideshow-page',
        fullscreen ? 'is-fullscreen' : '',
        chromeHidden ? 'is-chrome-hidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Photo slideshow"
      style={{ '--slideshow-fade-ms': `${FADE_MS}ms` } as CSSProperties}
      onPointerDown={(event) => {
        if (!fullscreen) return
        const target = event.target as HTMLElement | null
        if (target?.closest('.slideshow-chrome')) {
          revealChrome()
          return
        }
        if (chromeHidden) {
          event.preventDefault()
          revealChrome()
        } else {
          scheduleChromeHide()
        }
      }}
    >
      <audio
        ref={audioRef}
        src={SLIDESHOW_AUDIO}
        loop
        preload="auto"
        playsInline
        muted={muted}
      />

      <div className="slideshow-stage">
        {prevImage ? (
          <div className="slideshow-layer is-outgoing" key={`out-${prevImage.id}`}>
            <MediaImage
              src={prevImage.src}
              alt=""
              className="slideshow-image"
              loading="eager"
            />
          </div>
        ) : null}
        <div className="slideshow-layer is-incoming" key={`in-${image.id}`}>
          <MediaImage
            src={image.src}
            alt={image.alt}
            className="slideshow-image"
            loading="eager"
          />
        </div>
        {nextImage ? (
          <img src={nextImage.src} alt="" className="slideshow-preload" aria-hidden="true" />
        ) : null}
      </div>

      <div
        className={`slideshow-chrome${chromeVisible || !fullscreen ? ' is-visible' : ''}`}
        aria-hidden={chromeHidden}
      >
        <p className="slideshow-count">
          {index + 1} / {total}
        </p>

        {needsGesture || muted ? (
          <p className="slideshow-audio-hint">
            {muted
              ? 'Playing muted — tap Sound on for Road to Redemption.'
              : 'Tap Sound on to allow audio.'}
          </p>
        ) : null}

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
            className={!muted ? 'is-active' : undefined}
            onClick={() => toggleMute()}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            aria-pressed={!muted}
          >
            {muted ? 'Sound on' : 'Mute'}
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
