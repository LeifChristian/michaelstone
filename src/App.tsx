import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
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
              <Suspense fallback={<PageFallback />}>
                <Music />
              </Suspense>
            }
          />
          <Route
            path="gallery"
            element={
              <Suspense fallback={<PageFallback />}>
                <Gallery />
              </Suspense>
            }
          />
          <Route
            path="biography"
            element={
              <Suspense fallback={<PageFallback />}>
                <Biography />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
