import {
  json,
  publicEntry,
  requireAdmin,
  type GuestbookEntryRow,
  type GuestbookStatus,
} from '../_guestbook'

type Env = {
  DB: D1Database
  GUESTBOOK_ADMIN_SECRET?: string
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const denied = requireAdmin(context.request, context.env.GUESTBOOK_ADMIN_SECRET)
  if (denied) return denied

  const url = new URL(context.request.url)
  const statusParam = (url.searchParams.get('status') || 'pending') as GuestbookStatus
  const status: GuestbookStatus =
    statusParam === 'approved' || statusParam === 'rejected' || statusParam === 'pending'
      ? statusParam
      : 'pending'

  const { results } = await context.env.DB.prepare(
    `SELECT id, name, message, word_count, status, created_at, moderated_at
     FROM guestbook_entries
     WHERE status = ?
     ORDER BY created_at DESC
     LIMIT 200`,
  )
    .bind(status)
    .all<GuestbookEntryRow>()

  return json({
    entries: (results ?? []).map((row) => ({
      ...publicEntry(row),
      status: row.status,
      moderatedAt: row.moderated_at,
    })),
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const denied = requireAdmin(context.request, context.env.GUESTBOOK_ADMIN_SECRET)
  if (denied) return denied

  let body: { id?: string; action?: string }
  try {
    body = (await context.request.json()) as { id?: string; action?: string }
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const id = String(body.id ?? '').trim()
  const action = String(body.action ?? '').trim()
  if (!id) return json({ error: 'Missing entry id.' }, 400)
  if (action !== 'approve' && action !== 'reject') {
    return json({ error: 'Action must be approve or reject.' }, 400)
  }

  const status: GuestbookStatus = action === 'approve' ? 'approved' : 'rejected'
  const moderatedAt = new Date().toISOString()

  const result = await context.env.DB.prepare(
    `UPDATE guestbook_entries
     SET status = ?, moderated_at = ?
     WHERE id = ?`,
  )
    .bind(status, moderatedAt, id)
    .run()

  if (!result.meta.changes) {
    return json({ error: 'Entry not found.' }, 404)
  }

  return json({ ok: true, id, status })
}
