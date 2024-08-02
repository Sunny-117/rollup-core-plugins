import build from "./core/rollup-plugin-build.js"
import { defineConfig } from 'rollup'

export default defineConfig({
  input: "./src/index.js",
  output: {
    dir: 'dist',
  },
  plugins: [
    build()
  ]
})
