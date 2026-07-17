import { Link } from 'react-router-dom'
import { MediaImage } from '../components/MediaImage'
import { site } from '../config/site'

export function Home() {
  const share = async () => {
    const payload = {
      title: site.shareText,
      text: site.description,
      url: site.url,
    }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        return
      }
    } catch {
      /* user cancelled share */
      return
    }

    try {
      await navigator.clipboard.writeText(site.url)
    } catch {
      window.prompt('Copy this link to share:', site.url)
    }
  }

  return (
    <section className="home">
      <div className="hero">
        <div className="hero-media">
          <MediaImage
            src={site.heroImage}
            alt={site.heroAlt}
            className="hero-image"
            loading="eager"
          />
        </div>

        <div className="hero-copy">
          <h1 className="hero-name">{site.name}</h1>
          <p className="hero-subtitle">{site.subtitle}</p>
          <p className="hero-intro">{site.description}</p>

          <div className="hero-actions">
            <Link to="/music" className="button button-primary">
              Listen to his music
            </Link>
            <button type="button" className="button button-ghost" onClick={() => void share()}>
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="home-paths">
        <Link to="/gallery" className="path-link">
          <span>Photographs</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link to="/biography" className="path-link">
          <span>His story</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
