import { defineConfig } from 'rollup'
import build from './core/rollup-plugin-build.js'
import buildStart from './build/plugin-buildStart.js'
import injectPolyfillPlugin from './build/plugin-polyfill.js'

export default defineConfig({
  input: './src/index.js',
  output: {
    dir: 'dist',
  },
  plugins: [
    // build()
    // buildStart()
    injectPolyfillPlugin()
  ],
})
