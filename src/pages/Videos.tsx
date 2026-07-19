const videos = [
  {
    title: 'Renaissance Man – Spoken Word',
    src: 'https://player.vimeo.com/video/756011964',
    type: 'vimeo' as const,
  },
  {
    title: 'A Man of a Passion – Spoken Word',
    src: 'https://player.vimeo.com/video/756011799',
    type: 'vimeo' as const,
  },
  {
    title: 'City of Angels – Spoken Word',
    src: 'https://player.vimeo.com/video/756011667',
    type: 'vimeo' as const,
  },
  {
    title: 'Michael Stone',
    src: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F1HjAXFa942%2F&show_text=false',
    type: 'facebook' as const,
  },
]

export function Videos() {
  return (
    <section className="videos-page">
      <h1 className="page-title">Videos</h1>
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.src} className="video-card">
            <div className="video-embed">
              <iframe
                src={video.src}
                title={video.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="video-title">{video.title}</h2>
          </div>
        ))}
      </div>
    </section>
  )
}
