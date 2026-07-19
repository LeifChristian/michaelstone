import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Music } from './pages/Music'
import { Gallery } from './pages/Gallery'
import { Biography } from './pages/Biography'
import { Lyrics } from './pages/Lyrics'
import { Videos } from './pages/Videos'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="music" element={<Music />} />
          <Route path="lyrics" element={<Lyrics />} />
          <Route path="videos" element={<Videos />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="biography" element={<Biography />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
