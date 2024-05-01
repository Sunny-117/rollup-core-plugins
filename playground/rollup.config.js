import { defineConfig } from 'rollup'
import virtualModule from 'rollup-plugin-virtual'

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
    // json(),
    // customPlugin({
    //   emitFile: true,
    // }),
  ],
})
