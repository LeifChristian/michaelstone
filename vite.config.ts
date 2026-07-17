import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function scanMediaPlugin(): Plugin {
  const run = () => {
    execSync('node scripts/scan-media.mjs', {
      cwd: __dirname,
      stdio: 'inherit',
    })
  }

  return {
    name: 'scan-media',
    buildStart() {
      run()
    },
    configureServer(server) {
      run()
      const imagesDir = resolve(__dirname, 'public/images')
      const musicDir = resolve(__dirname, 'public/music')
      server.watcher.add([imagesDir, musicDir])
      server.watcher.on('all', (_event, file) => {
        if (file.startsWith(imagesDir) || file.startsWith(musicDir)) {
          run()
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), scanMediaPlugin()],
})
