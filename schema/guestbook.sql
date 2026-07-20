CREATE TABLE IF NOT EXISTS guestbook_entries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  moderated_at TEXT,
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_guestbook_status_created
  ON guestbook_entries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_guestbook_ip_created
  ON guestbook_entries (ip_hash, created_at DESC);
