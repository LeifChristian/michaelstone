import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function scanContentPlugin(): Plugin {
  const run = () => {
    execSync('npm run scan', { cwd: __dirname, stdio: 'inherit' })
  }

  return {
    name: 'scan-content',
    buildStart() {
      run()
    },
    configureServer(server) {
      run()
      const watchDirs = [
        resolve(__dirname, 'public/images'),
        resolve(__dirname, 'public/music'),
        resolve(__dirname, 'content/lyrics'),
      ]
      server.watcher.add(watchDirs)
      server.watcher.on('all', (_event, file) => {
        if (watchDirs.some((dir) => file.startsWith(dir))) {
          run()
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), scanContentPlugin()],
})
