import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // A globally exported NODE_ENV=production breaks react-refresh in dev
  // ($RefreshReg$ is not defined) — force the matching env per command.
  process.env.NODE_ENV = command === 'serve' ? 'development' : 'production'
  return {
    plugins: [react()],
  }
})
