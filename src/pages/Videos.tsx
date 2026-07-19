type Video =
  | {
      title: string
      type: 'local'
      src: string
    }
  | {
      title: string
      type: 'vimeo'
      embedSrc: string
      watchUrl: string
    }
  | {
      title: string
      type: 'youtube'
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
    title: 'Michael Stone',
    type: 'local',
    src: '/videos/01-michael.mp4',
  },
  {
    title: 'Soldier – Michael Stone',
    type: 'youtube',
    embedSrc: 'https://www.youtube.com/embed/uu4od9A9j5s',
    watchUrl: 'https://www.youtube.com/watch?v=uu4od9A9j5s',
  },
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
          <div
            key={video.type === 'local' ? video.src : video.watchUrl}
            className="video-card"
          >
            {video.type === 'local' ? (
              <>
                <div className="video-embed video-embed-local">
                  <video
                    src={video.src}
                    controls
                    playsInline
                    preload="metadata"
                    title={video.title}
                  >
                    <a href={video.src}>Download video</a>
                  </video>
                </div>
                <div className="video-meta">
                  <h2 className="video-title">{video.title}</h2>
                </div>
              </>
            ) : video.type === 'vimeo' || video.type === 'youtube' ? (
              <>
                <div className="video-embed">
                  <iframe
                    src={video.embedSrc}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
                    {video.type === 'youtube' ? 'Watch on YouTube' : 'Watch on Vimeo'}
                  </a>
                </div>
              </>
            ) : (
              <div className="video-link-card">
                <h2 className="video-title">{video.title}</h2>
                <p className="video-link-note">Opens in a new tab.</p>
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
