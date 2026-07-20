export const MAX_GUESTBOOK_WORDS = 3000
export const MAX_GUESTBOOK_NAME = 80
export const MAX_GUESTBOOK_CHARS = 24_000

export type GuestbookEntry = {
  id: string
  name: string
  message: string
  wordCount: number
  createdAt: string
  status?: 'pending' | 'approved' | 'rejected'
  moderatedAt?: string | null
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function formatGuestbookDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
