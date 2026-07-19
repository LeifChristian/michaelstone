import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RouteErrorBoundary } from './components/RouteErrorBoundary'
import { Home } from './pages/Home'

const Music = lazy(() =>
  import('./pages/Music').then((m) => ({ default: m.Music })),
)
const Gallery = lazy(() =>
  import('./pages/Gallery').then((m) => ({ default: m.Gallery })),
)
const Biography = lazy(() =>
  import('./pages/Biography').then((m) => ({ default: m.Biography })),
)
const Lyrics = lazy(() =>
  import('./pages/Lyrics').then((m) => ({ default: m.Lyrics })),
)
const Videos = lazy(() =>
  import('./pages/Videos').then((m) => ({ default: m.Videos })),
)

function PageFallback() {
  return <div className="page-fallback" aria-live="polite">Loading…</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="music"
            element={
              <RouteErrorBoundary label="Music">
                <Suspense fallback={<PageFallback />}>
                  <Music />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="lyrics"
            element={
              <RouteErrorBoundary label="Lyrics">
                <Suspense fallback={<PageFallback />}>
                  <Lyrics />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="videos"
            element={
              <RouteErrorBoundary label="Videos">
                <Suspense fallback={<PageFallback />}>
                  <Videos />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="gallery"
            element={
              <RouteErrorBoundary label="Photos">
                <Suspense fallback={<PageFallback />}>
                  <Gallery />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="biography"
            element={
              <RouteErrorBoundary label="Story">
                <Suspense fallback={<PageFallback />}>
                  <Biography />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
