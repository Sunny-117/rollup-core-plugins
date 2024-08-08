import { defineConfig } from 'rollup'
import build from './core/rollup-plugin-build.js'
import buildStart from './build/plugin-buildStart.js'
import injectPolyfillPlugin from './build/plugin-polyfill-core.js'
import Babel from './build/rollup-plugin-babel.js'

export default defineConfig({
  input: './src/index.js',
  output: {
    dir: 'dist',
  },
  plugins: [
    // build()
    // buildStart()
    // injectPolyfillPlugin()
    // Babel({
    //   include: './src',
    //   extensions: ['.js', '.jsx'],
    //   presets: [
    //     "@babel/preset-env"
    //   ]
    // })
  ],
})
