type Video =
  | {
      title: string
      type: 'vimeo'
      embedSrc: string
      watchUrl: string
    }
  | {
      title: string
      type: 'link'
      watchUrl: string
      label: string
    }

const videos: Video[] = [
  {
    title: 'Renaissance Man – Spoken Word',
    type: 'vimeo',
    embedSrc: 'https://player.vimeo.com/video/756011964',
    watchUrl: 'https://vimeo.com/756011964',
  },
  {
    title: 'A Man of a Passion – Spoken Word',
    type: 'link',
    watchUrl: 'https://vimeo.com/756011799',
    label: 'Watch on Vimeo',
  },
  {
    title: 'City of Angels – Spoken Word',
    type: 'vimeo',
    embedSrc: 'https://player.vimeo.com/video/756011667',
    watchUrl: 'https://vimeo.com/756011667',
  },
  {
    title: 'Michael Stone',
    type: 'link',
    watchUrl: 'https://www.facebook.com/share/v/1HjAXFa942/',
    label: 'Watch on Facebook',
  },
]

export function Videos() {
  return (
    <section className="videos-page">
      <h1 className="page-title">Videos</h1>
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.watchUrl} className="video-card">
            {video.type === 'vimeo' ? (
              <>
                <div className="video-embed">
                  <iframe
                    src={video.embedSrc}
                    title={video.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-meta">
                  <h2 className="video-title">{video.title}</h2>
                  <a
                    className="video-watch-link"
                    href={video.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch on Vimeo
                  </a>
                </div>
              </>
            ) : (
              <div className="video-link-card">
                <h2 className="video-title">{video.title}</h2>
                <p className="video-link-note">
                  Opens in a new tab.
                </p>
                <a
                  className="button button-primary"
                  href={video.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {video.label}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
