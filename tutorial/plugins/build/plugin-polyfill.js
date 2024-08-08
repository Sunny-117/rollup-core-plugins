// 入口模块的话，插件自动引入 import 'polyfill'
export default function injectPolyfillPlugin() {
  return {
    name: 'inject-polyfill',
  }
}
