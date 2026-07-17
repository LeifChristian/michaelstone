import { Link } from 'react-router-dom'
import { lyrics, lyricsSection } from '../config/lyrics'

export function Lyrics() {
  const withLyrics = lyrics.filter((item) => item.body)

  return (
    <section className="page lyrics-page">
      <header className="page-header">
        <h1>{lyricsSection.title}</h1>
        <p>{lyricsSection.subtitle}</p>
      </header>

      {!withLyrics.length ? (
        <div className="empty-state">
          <p>No lyrics yet.</p>
          <p className="empty-hint">
            Add <code>.txt</code> files to <code>content/lyrics/</code> and rebuild.
          </p>
        </div>
      ) : (
        <div className="poem-list">
          {lyrics.map((item, index) => (
            <article key={item.id} className="poem" id={item.id}>
              <header className="poem-header">
                <span className="poem-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="poem-heading">
                  <h2>{item.title}</h2>
                  {item.trackId ? (
                    <Link to="/music" className="poem-listen">
                      Listen →
                    </Link>
                  ) : null}
                </div>
              </header>

              {item.body ? (
                <div className="poem-body">{item.body}</div>
              ) : (
                <p className="poem-missing">Lyrics not yet available for this song.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
