import { defineConfig } from 'rollup'
import build from './core/rollup-plugin-build.js'

export default defineConfig({
  input: './src/index.js',
  output: {
    dir: 'dist',
  },
  plugins: [build()],
})
