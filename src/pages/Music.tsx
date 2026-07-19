import { useState } from 'react'
import { AudioPlayer } from '../components/AudioPlayer'
import { album, tracks } from '../config/music'

const DOWNLOADS_KEY = 'michaelstone:downloads'

export function Music() {
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [downloadsEnabled, setDownloadsEnabled] = useState(() => {
    const stored = localStorage.getItem(DOWNLOADS_KEY)
    return stored === null ? true : stored === '1'
  })

  const toggleDownloads = () => {
    setDownloadsEnabled((prev) => {
      const next = !prev
      localStorage.setItem(DOWNLOADS_KEY, next ? '1' : '0')
      return next
    })
  }

  return (
    <section className="page music-page">
      <header className="page-header">
        <h1>{album.title}</h1>
        <p>{album.subtitle}</p>
        <label className="downloads-toggle">
          <input
            type="checkbox"
            checked={downloadsEnabled}
            onChange={toggleDownloads}
          />
          <span>Allow downloads</span>
        </label>
      </header>

      <AudioPlayer
        tracks={tracks}
        currentId={currentId}
        onSelect={setCurrentId}
        downloadsEnabled={downloadsEnabled}
      />
    </section>
  )
}
