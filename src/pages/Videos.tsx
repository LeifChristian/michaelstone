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
    type: 'vimeo',
    embedSrc: 'https://player.vimeo.com/video/756011799',
    watchUrl: 'https://vimeo.com/756011799',
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
                  This one can&apos;t be embedded here — open it on Facebook.
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
      <p className="video-privacy-note">
        If a Vimeo player says &quot;Sorry&quot;, the video owner needs to allow embeds for{' '}
        <code>michaelstonepoet.com</code> and <code>michaelstone.pages.dev</code> in
        Vimeo → Settings → Privacy.
      </p>
    </section>
  )
}
