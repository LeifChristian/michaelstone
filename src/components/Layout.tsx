import { useEffect, useId, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { site } from '../config/site'
import { ThemeToggle } from './ThemeToggle'

const links: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/music', label: 'Music' },
  { to: '/lyrics', label: 'Lyrics' },
  { to: '/videos', label: 'Videos' },
  { to: '/gallery', label: 'Photos' },
  { to: '/guestbook', label: 'Guestbook' },
  { to: '/biography', label: 'Story' },
]

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const menuId = useId()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`site-header${menuOpen ? ' is-menu-open' : ''}`}>
        <button
          type="button"
          className="nav-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-menu-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>

        <NavLink to="/" className="brand" end onClick={() => setMenuOpen(false)}>
          {site.name}
        </NavLink>

        <div className="header-actions">
          <nav
            id={menuId}
            className={`site-nav${menuOpen ? ' is-open' : ''}`}
            aria-label="Primary"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  isActive ? 'nav-link is-active' : 'nav-link'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {menuOpen ? (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
      </header>

      <main id="main" className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>In memory of {site.name}</p>
        <p className="footer-quiet">{site.url.replace(/^https?:\/\//, '')}</p>
      </footer>
    </div>
  )
}
