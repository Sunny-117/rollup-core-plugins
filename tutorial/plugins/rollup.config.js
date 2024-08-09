import { defineConfig } from 'rollup'
import build from './core/rollup-plugin-build.js'
import buildStart from './build/plugin-buildStart.js'
import injectPolyfillPlugin from './build/plugin-polyfill-core.js'
import Babel from './build/rollup-plugin-babel.js'
import generation from './output/rollup-plugin-generation.js'
import dynamicImportPolyfillPlugin from './output/rollup-plugin-renderDynamicImport.js'
import resolveFileUrl from './output/rollup-plugin-resolveFileUrl.js'

export default defineConfig({
  input: './src/index3.js',
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
    // generation()
    // dynamicImportPolyfillPlugin()
    resolveFileUrl()
  ],
})
