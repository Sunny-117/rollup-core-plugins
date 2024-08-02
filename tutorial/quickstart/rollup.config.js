import babel from '@rollup/plugin-babel'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  // input: ['src/main.js'],
  input: 'src/main.ts',
  output: {
    // dir: 'dist',
    file: 'dist/bundle.cjs.js',//输出文件的路径和名称
    format: 'iife',//五种输出格式：amd/es6/iife/umd/cjs
    name: 'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
    globals: {
      lodash: '_', //告诉rollup全局变量_即是lodash
      jquery: '$' //告诉rollup全局变量$即是jquery
    }
  },
  external: ['lodash', 'jquery'],
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    typescript()
  ]
})
