import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatGuestbookDate, type GuestbookEntry } from '../lib/guestbook'

const STORAGE_KEY = 'michaelstone:guestbook-admin'

type StatusFilter = 'pending' | 'approved' | 'rejected'

export function GuestbookModerate() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '')
  const [draftSecret, setDraftSecret] = useState('')
  const [status, setStatus] = useState<StatusFilter>('pending')
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!secret) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/guestbook/moderate?status=${status}`, {
        headers: { authorization: `Bearer ${secret}` },
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        entries?: GuestbookEntry[]
      }
      if (!res.ok) {
        setError(data.error || 'Could not load entries.')
        setEntries([])
        return
      }
      setEntries(data.entries ?? [])
    } catch {
      setError('Could not reach the moderation API.')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [secret, status])

  useEffect(() => {
    void load()
  }, [load])

  function onUnlock(event: FormEvent) {
    event.preventDefault()
    const value = draftSecret.trim()
    if (!value) return
    sessionStorage.setItem(STORAGE_KEY, value)
    setSecret(value)
    setDraftSecret('')
  }

  function onLock() {
    sessionStorage.removeItem(STORAGE_KEY)
    setSecret('')
    setEntries([])
  }

  async function moderate(id: string, action: 'approve' | 'reject') {
    if (!secret) return
    setBusyId(id)
    setError(null)
    try {
      const res = await fetch('/api/guestbook/moderate', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${secret}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ id, action }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Could not update that note.')
        return
      }
      await load()
    } catch {
      setError('Could not update that note.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="page guestbook-page">
      <header className="page-header">
        <h1>Moderate guestbook</h1>
        <p>
          Review notes before they go public.{' '}
          <Link to="/guestbook">Back to guestbook</Link>
        </p>
      </header>

      {!secret ? (
        <form className="guestbook-form" onSubmit={onUnlock}>
          <label className="guestbook-label">
            Admin secret
            <input
              type="password"
              autoComplete="current-password"
              value={draftSecret}
              onChange={(e) => setDraftSecret(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="button button-primary">
            Unlock
          </button>
        </form>
      ) : (
        <>
          <div className="guestbook-moderate-toolbar">
            <div className="guestbook-filter" role="group" aria-label="Filter by status">
              {(['pending', 'approved', 'rejected'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={status === value ? 'is-active' : undefined}
                  onClick={() => setStatus(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="guestbook-moderate-actions">
              <button type="button" className="button button-ghost" onClick={() => void load()}>
                Refresh
              </button>
              <button type="button" className="button button-ghost" onClick={onLock}>
                Lock
              </button>
            </div>
          </div>

          {error ? <p className="guestbook-alert is-error">{error}</p> : null}
          {loading ? <p className="guestbook-muted">Loading…</p> : null}

          {!loading && entries.length === 0 ? (
            <p className="guestbook-muted">No {status} notes.</p>
          ) : null}

          <ul className="guestbook-list">
            {entries.map((entry) => (
              <li key={entry.id} className="guestbook-entry">
                <header className="guestbook-entry-header">
                  <strong>{entry.name}</strong>
                  <time dateTime={entry.createdAt}>{formatGuestbookDate(entry.createdAt)}</time>
                </header>
                <p className="guestbook-entry-body">{entry.message}</p>
                <p className="guestbook-entry-meta">
                  {entry.wordCount.toLocaleString()} words · {entry.id}
                </p>
                {status === 'pending' ? (
                  <div className="guestbook-moderate-actions">
                    <button
                      type="button"
                      className="button button-primary"
                      disabled={busyId === entry.id}
                      onClick={() => void moderate(entry.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="button button-ghost"
                      disabled={busyId === entry.id}
                      onClick={() => void moderate(entry.id, 'reject')}
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
