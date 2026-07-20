import {
  MAX_MESSAGE_CHARS,
  MAX_PENDING_PER_IP_DAY,
  MAX_WORDS,
  MIN_WORDS,
  clientIp,
  countWords,
  hashIp,
  json,
  publicEntry,
  sanitizeName,
  sanitizePlainText,
  type GuestbookEntryRow,
} from './_guestbook'

type Env = {
  DB: D1Database
  GUESTBOOK_ADMIN_SECRET?: string
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { results } = await context.env.DB.prepare(
    `SELECT id, name, message, word_count, status, created_at, moderated_at
     FROM guestbook_entries
     WHERE status = 'approved'
     ORDER BY created_at DESC
     LIMIT 200`,
  ).all<GuestbookEntryRow>()

  return json({
    entries: (results ?? []).map(publicEntry),
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: Record<string, unknown>
  try {
    body = (await context.request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  // Honeypot — bots fill hidden fields; humans leave them empty.
  const honeypot = String(body.company ?? body.website ?? '').trim()
  if (honeypot) {
    return json({ ok: true, status: 'pending' }, 201)
  }

  const name = sanitizeName(String(body.name ?? ''))
  const message = sanitizePlainText(String(body.message ?? ''))

  if (!name) {
    return json({ error: 'Please include your name.' }, 400)
  }
  if (!message) {
    return json({ error: 'Please write a short note.' }, 400)
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return json(
      { error: `Message is too long (max ${MAX_MESSAGE_CHARS.toLocaleString()} characters).` },
      400,
    )
  }

  const wordCount = countWords(message)
  if (wordCount < MIN_WORDS) {
    return json({ error: 'Please write a short note.' }, 400)
  }
  if (wordCount > MAX_WORDS) {
    return json(
      { error: `Please keep your note to ${MAX_WORDS.toLocaleString()} words or fewer (currently ${wordCount.toLocaleString()}).` },
      400,
    )
  }

  const ip = clientIp(context.request)
  const secret = context.env.GUESTBOOK_ADMIN_SECRET || 'guestbook'
  const ipHash = await hashIp(ip, secret)
  const userAgent = (context.request.headers.get('user-agent') || '').slice(0, 240)

  if (ipHash) {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recent = await context.env.DB.prepare(
      `SELECT COUNT(*) AS n
       FROM guestbook_entries
       WHERE ip_hash = ? AND created_at >= ?`,
    )
      .bind(ipHash, dayAgo)
      .first<{ n: number }>()

    if ((recent?.n ?? 0) >= MAX_PENDING_PER_IP_DAY) {
      return json(
        { error: 'Thanks — you’ve already sent a few notes today. Please try again tomorrow.' },
        429,
      )
    }
  }

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  await context.env.DB.prepare(
    `INSERT INTO guestbook_entries
      (id, name, message, word_count, status, created_at, moderated_at, ip_hash, user_agent)
     VALUES (?, ?, ?, ?, 'pending', ?, NULL, ?, ?)`,
  )
    .bind(id, name, message, wordCount, createdAt, ipHash, userAgent)
    .run()

  return json(
    {
      ok: true,
      status: 'pending',
      message: 'Thank you. Your note was received and will appear after it’s reviewed.',
    },
    201,
  )
}
