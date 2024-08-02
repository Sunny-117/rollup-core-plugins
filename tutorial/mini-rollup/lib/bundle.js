const path = require('node:path')
const fs = require('node:fs')
const Module = require('./module')

class Bundle {
  constructor(options) {
    // 入口文件绝对路径
    this.entryPath = path.resolve(options.entry)
  }
  build(output) {
    // 获取入口文件对应的模块
    const entryModule = this.fetchModule(this.entryPath)
    console.log('entryModule:', entryModule)
  }
  /**
   * 根据文件路径获取模块
   * @param {*} importee 此模块真实的文件路径
   */
  fetchModule(importee) {
    const route = importee
    if (route) {
      const code = fs.readFileSync(route, 'utf8')
      const module = new Module({
        code,
        path: route,
        bundle: this,
      })
    }
  }
}
module.exports = Bundle
