import { NavLink, Outlet } from 'react-router-dom'
import { site } from '../config/site'
import { ThemeToggle } from './ThemeToggle'

const links: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/music', label: 'Music' },
  { to: '/lyrics', label: 'Lyrics' },
  { to: '/videos', label: 'Videos' },
  { to: '/gallery', label: 'Photos' },
  { to: '/biography', label: 'Story' },
]

export function Layout() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <NavLink to="/" className="brand" end>
          {site.name}
        </NavLink>
        <div className="header-actions">
          <nav className="site-nav" aria-label="Primary">
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
