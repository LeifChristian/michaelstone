import { generatedLyrics } from './lyrics.generated'

export type Lyric = {
  id: string
  title: string
  trackId: string | null
  body: string | null
}

export const lyricsSection = {
  title: 'Lyrics',
  subtitle: 'Michael’s words, song by song.',
} as const

export const lyrics: Lyric[] = generatedLyrics
