import { useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import { MediaImage } from '../components/MediaImage'
import { galleryImages } from '../config/gallery'

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="page gallery-page">
      <header className="page-header">
        <h1>Photographs</h1>
        <p>Moments kept so they can still be seen.</p>
      </header>

      {!galleryImages.length ? (
        <div className="empty-state">
          <p>No photographs yet.</p>
          <p className="empty-hint">
            Add images to <code>public/images/</code> named like{' '}
            <code>01-name.jpg</code>, <code>02-name.jpg</code>. Use{' '}
            <code>hero.jpg</code> for the homepage portrait.
          </p>
        </div>
      ) : (
        <ul className="gallery-grid">
          {galleryImages.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                className="gallery-item"
                onClick={() => setActiveIndex(index)}
                aria-label={`Open photo: ${image.alt}`}
              >
                <MediaImage
                  src={image.src}
                  alt={image.alt}
                  className="gallery-image"
                  sizes="(max-width: 700px) 50vw, 33vw"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {activeIndex !== null ? (
        <Lightbox
          images={galleryImages}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      ) : null}
    </section>
  )
}
