import { defineConfig } from 'rollup'
import virtualModule from '@rps/rollup-plugin-virtual'
// import json from '@rps/rollup-plugin-json'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    virtualModule({
      content: 'export default () => "Hello, world!"',
    }),
    // json(), // https://github.com/evanw/esbuild/issues/3324
    // customPlugin({
    //   emitFile: true,
    // }),
  ],
})
