import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default ({ mode = 'dev' }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    plugins: [react(), svgr()],
    define: {
      'process.env': env,
    },
  })
}
