import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'michaelstone:theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#121614' : '#e8ebe6')
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5-2.5a1 1 0 1 1 0-2H18a1 1 0 1 1 0 2h1.5ZM6 12a1 1 0 0 1-1 1H3.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1 1Zm10.95 5.45a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM9.52 6.08a1 1 0 0 1-1.41 0L7.05 5.02A1 1 0 0 1 8.46 3.6l1.06 1.07a1 1 0 0 1 0 1.41Zm0 11.84a1 1 0 0 1-1.41 0L7.05 16.86a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41Zm8.43-11.84a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L17.6 3.6a1 1 0 1 1 1.41 1.42L17.95 6.08Z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.6 3.1a1 1 0 0 1 1.17 1.3A7.5 7.5 0 1 0 19.6 14a1 1 0 0 1 1.3-1.17 9.5 9.5 0 1 1-6.3-9.73Z"
      />
    </svg>
  )
}
