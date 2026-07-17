import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { Track } from '../config/music'

type AudioPlayerProps = {
  tracks: Track[]
  currentId: string | null
  onSelect: (id: string) => void
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({ tracks, currentId, onSelect }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [durations, setDurations] = useState<Record<string, string>>({})

  const current = tracks.find((t) => t.id === currentId) ?? null
  const currentIndex = current ? tracks.findIndex((t) => t.id === current.id) : -1

  const syncFromAudio = useEffectEvent(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setDuration(audio.duration || 0)
    setPlaying(!audio.paused)
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) {
      setPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      return
    }

    audio.src = current.src
    audio.load()

    const play = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }

    void play()
  }, [current?.id, current?.src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      syncFromAudio()
      if (currentId && Number.isFinite(audio.duration) && audio.duration > 0) {
        setDurations((prev) => ({
          ...prev,
          [currentId]: formatTime(audio.duration),
        }))
      }
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      setPlaying(false)
      const index = tracks.findIndex((t) => t.id === currentId)
      const next = tracks[index + 1]
      if (next) onSelect(next.id)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onTime)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onTime)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [currentId, onSelect, syncFromAudio, tracks])

  /** Prefetch durations for the track list */
  useEffect(() => {
    const cleanups: Array<() => void> = []

    tracks.forEach((track) => {
      const audio = new Audio()
      audio.preload = 'metadata'
      const onMeta = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDurations((prev) => ({
            ...prev,
            [track.id]: formatTime(audio.duration),
          }))
        }
      }
      audio.addEventListener('loadedmetadata', onMeta)
      audio.src = track.src
      cleanups.push(() => {
        audio.removeEventListener('loadedmetadata', onMeta)
        audio.removeAttribute('src')
        audio.load()
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [tracks])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!current) {
      if (tracks[0]) onSelect(tracks[0].id)
      return
    }

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        /* autoplay may be blocked until user gesture */
      }
    } else {
      audio.pause()
    }
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const playPrev = () => {
    if (currentIndex > 0) onSelect(tracks[currentIndex - 1].id)
  }

  const playNext = () => {
    if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
      onSelect(tracks[currentIndex + 1].id)
    }
  }

  if (!tracks.length) {
    return (
      <div className="empty-state">
        <p>No recordings yet.</p>
        <p className="empty-hint">
          Add mp3 files to <code>public/music/</code> named like{' '}
          <code>01-song-title.mp3</code>, then refresh.
        </p>
      </div>
    )
  }

  return (
    <div className="player" aria-label="Audio player">
      <audio ref={audioRef} preload="metadata" />

      <div className="player-meta">
        <p className="player-label">Now playing</p>
        <p className="player-title">{current?.title ?? 'Choose a track'}</p>
        {current?.description ? (
          <p className="player-desc">{current.description}</p>
        ) : null}
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button
            type="button"
            className="player-skip"
            onClick={playPrev}
            disabled={currentIndex <= 0}
            aria-label="Previous track"
          >
            <PrevIcon />
          </button>
          <button
            type="button"
            className="player-toggle"
            onClick={() => void toggle()}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className="player-skip"
            onClick={playNext}
            disabled={currentIndex < 0 || currentIndex >= tracks.length - 1}
            aria-label="Next track"
          >
            <NextIcon />
          </button>
        </div>

        <div className="player-timeline">
          <input
            type="range"
            className="player-seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            disabled={!current || !duration}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
          />
          <div className="player-times">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {current ? (
          <a
            className="player-download"
            href={current.src}
            download={current.downloadName}
            aria-label={`Download ${current.title}`}
          >
            <DownloadIcon />
            <span>Download</span>
          </a>
        ) : null}
      </div>

      <TrackList
        tracks={tracks}
        currentId={currentId}
        playing={playing}
        durations={durations}
        onSelect={onSelect}
      />
    </div>
  )
}

function TrackList({
  tracks,
  currentId,
  playing,
  durations,
  onSelect,
}: {
  tracks: Track[]
  currentId: string | null
  playing: boolean
  durations: Record<string, string>
  onSelect: (id: string) => void
}) {
  return (
    <ol className="track-list">
      {tracks.map((track, index) => {
        const active = track.id === currentId
        return (
          <li key={track.id} className="track-row">
            <button
              type="button"
              className={active ? 'track is-active' : 'track'}
              onClick={() => onSelect(track.id)}
              aria-current={active ? 'true' : undefined}
            >
              <span className="track-index" aria-hidden="true">
                {active && playing ? (
                  <Equalizer />
                ) : (
                  String(index + 1).padStart(2, '0')
                )}
              </span>
              <span className="track-body">
                <span className="track-title">{track.title}</span>
                {track.description ? (
                  <span className="track-desc">{track.description}</span>
                ) : null}
              </span>
              <span className="track-duration">
                {durations[track.id] ?? track.duration ?? '—:—'}
              </span>
            </button>
            <a
              className="track-download"
              href={track.src}
              download={track.downloadName}
              aria-label={`Download ${track.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <DownloadIcon />
              <span className="track-download-label">Download</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" />
    </svg>
  )
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M6 6h2.2v12H6V6zm3.2 6 8.8 6V6l-8.8 6z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M15.8 6H18v12h-2.2V6zM6 18l8.8-6L6 6v12z" />
    </svg>
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

function Equalizer() {
  return (
    <span className="eq" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}
