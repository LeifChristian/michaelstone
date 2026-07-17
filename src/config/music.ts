import { generatedTracks } from './media.generated'

export type Track = {
  id: string
  title: string
  src: string
  filename: string
  downloadName: string
  duration?: string
  description?: string
}

export const album = {
  title: 'Music',
  subtitle: 'Listen to Michael’s recordings. Download any track to keep.',
} as const

/**
 * Tracks are auto-discovered from public/music.
 * Prefer mp3. Name them like: 01-song-title.mp3, 02-another.mp3
 * Title is derived from the filename (number prefix stripped).
 */
export const tracks: Track[] = generatedTracks
