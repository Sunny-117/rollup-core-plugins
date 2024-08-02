import babel from '@rollup/plugin-babel'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.cjs.js',//输出文件的路径和名称
    format: 'cjs',//五种输出格式：amd/es6/iife/umd/cjs
    name: 'bundleName'//当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
})
