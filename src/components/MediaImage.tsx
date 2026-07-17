import { useState } from 'react'

type MediaImageProps = {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  sizes?: string
}

export function MediaImage({
  src,
  alt,
  className,
  loading = 'lazy',
  decoding = 'async',
  sizes,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={['media-fallback', className].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  )
}
