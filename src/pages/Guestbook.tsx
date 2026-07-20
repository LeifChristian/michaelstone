import { useEffect, useState, type FormEvent } from 'react'
import {
  MAX_GUESTBOOK_CHARS,
  MAX_GUESTBOOK_NAME,
  MAX_GUESTBOOK_WORDS,
  countWords,
  formatGuestbookDate,
  type GuestbookEntry,
} from '../lib/guestbook'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const [successNote, setSuccessNote] = useState<string | null>(null)

  const words = countWords(message)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/guestbook')
        if (!res.ok) throw new Error('Could not load notes.')
        const data = (await res.json()) as { entries: GuestbookEntry[] }
        if (!cancelled) {
          setEntries(data.entries ?? [])
          setLoadError(null)
        }
      } catch {
        if (!cancelled) {
          setLoadError('Notes will appear here once the guestbook is available.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    setSuccessNote(null)

    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) {
      setFormError('Please include your name.')
      return
    }
    if (!trimmedMessage) {
      setFormError('Please write a short note.')
      return
    }
    if (words > MAX_GUESTBOOK_WORDS) {
      setFormError(`Please keep your note to ${MAX_GUESTBOOK_WORDS.toLocaleString()} words or fewer.`)
      return
    }
    if (trimmedMessage.length > MAX_GUESTBOOK_CHARS) {
      setFormError('That note is a little too long. Please shorten it a bit.')
      return
    }

    setFormState('submitting')
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          company: honeypot,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        message?: string
      }
      if (!res.ok) {
        setFormState('error')
        setFormError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setFormState('success')
      setSuccessNote(
        data.message ||
          'Thank you. Your note was received and will appear after it’s reviewed.',
      )
      setName('')
      setMessage('')
      setHoneypot('')
    } catch {
      setFormState('error')
      setFormError('Could not send your note. Please try again in a moment.')
    }
  }

  return (
    <section className="page guestbook-page">
      <header className="page-header">
        <h1>Guestbook</h1>
        <p>Leave a note for Michael — a memory, a thank you, or a few words of love.</p>
      </header>

      <form className="guestbook-form" onSubmit={onSubmit} noValidate>
        <label className="guestbook-label">
          Your name
          <input
            type="text"
            name="name"
            autoComplete="name"
            maxLength={MAX_GUESTBOOK_NAME}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="guestbook-label">
          Your note
          <textarea
            name="message"
            rows={8}
            maxLength={MAX_GUESTBOOK_CHARS}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Share a memory or a few words…"
          />
        </label>

        {/* Honeypot — leave empty */}
        <label className="guestbook-honeypot" aria-hidden="true">
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>

        <div className="guestbook-form-meta">
          <span className={words > MAX_GUESTBOOK_WORDS ? 'is-over' : undefined}>
            {words.toLocaleString()} / {MAX_GUESTBOOK_WORDS.toLocaleString()} words
          </span>
          <span>Notes are reviewed before they appear.</span>
        </div>

        {formError ? <p className="guestbook-alert is-error">{formError}</p> : null}
        {successNote ? <p className="guestbook-alert is-success">{successNote}</p> : null}

        <button
          type="submit"
          className="button button-primary"
          disabled={formState === 'submitting' || words > MAX_GUESTBOOK_WORDS}
        >
          {formState === 'submitting' ? 'Sending…' : 'Send note'}
        </button>
      </form>

      <h2 className="guestbook-list-title">Notes</h2>

      {loading ? <p className="guestbook-muted">Loading notes…</p> : null}
      {loadError ? <p className="guestbook-muted">{loadError}</p> : null}

      {!loading && !loadError && entries.length === 0 ? (
        <p className="guestbook-muted">No public notes yet — be the first to leave one.</p>
      ) : null}

      <ul className="guestbook-list">
        {entries.map((entry) => (
          <li key={entry.id} className="guestbook-entry">
            <header className="guestbook-entry-header">
              <strong>{entry.name}</strong>
              <time dateTime={entry.createdAt}>{formatGuestbookDate(entry.createdAt)}</time>
            </header>
            <p className="guestbook-entry-body">{entry.message}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
