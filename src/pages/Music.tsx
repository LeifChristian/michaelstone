import { useState } from 'react'
import { AudioPlayer } from '../components/AudioPlayer'
import { album, tracks } from '../config/music'

export function Music() {
  const [currentId, setCurrentId] = useState<string | null>(null)

  return (
    <section className="page music-page">
      <header className="page-header">
        <h1>{album.title}</h1>
        <p>{album.subtitle}</p>
      </header>

      <AudioPlayer
        tracks={tracks}
        currentId={currentId}
        onSelect={setCurrentId}
      />
    </section>
  )
}
