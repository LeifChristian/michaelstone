export type GuestbookStatus = 'pending' | 'approved' | 'rejected'

export type GuestbookEntryRow = {
  id: string
  name: string
  message: string
  word_count: number
  status: GuestbookStatus
  created_at: string
  moderated_at: string | null
}

export const MAX_WORDS = 3000
export const MIN_WORDS = 1
export const MAX_NAME_CHARS = 80
export const MAX_MESSAGE_CHARS = 24_000
export const MAX_PENDING_PER_IP_DAY = 5

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  })
}

export function countWords(text: string): number {
  const parts = text.trim().split(/\s+/).filter(Boolean)
  return parts.length
}

/** Strip tags/control chars and normalize plain text for storage. */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u2028\u2029]/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function sanitizeName(input: string): string {
  return sanitizePlainText(input).replace(/\n+/g, ' ').slice(0, MAX_NAME_CHARS).trim()
}

export async function hashIp(ip: string, secret: string): Promise<string | null> {
  if (!ip || ip === 'unknown') return null
  const data = new TextEncoder().encode(`${secret}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

export function requireAdmin(request: Request, secret: string | undefined): Response | null {
  if (!secret) {
    return json({ error: 'Moderation is not configured yet.' }, 503)
  }
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  const alt = request.headers.get('x-guestbook-admin')?.trim() || ''
  if (token !== secret && alt !== secret) {
    return json({ error: 'Unauthorized' }, 401)
  }
  return null
}

export function publicEntry(row: GuestbookEntryRow) {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    wordCount: row.word_count,
    createdAt: row.created_at,
  }
}
