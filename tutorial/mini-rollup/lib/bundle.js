const path = require('node:path')
const fs = require('node:fs')
const Module = require('./module')
const MagicString = require('magic-string')
const { addSuffix } = require('./utils')
class Bundle {
  constructor(options) {
    // 入口文件绝对路径
    this.entryPath = path.resolve(addSuffix(options.entry))
    this.modules = new Set()
  }
  build(output) {
    // 获取入口文件对应的模块
    const entryModule = this.fetchModule(this.entryPath)
    // console.log('entryModule:', entryModule)
    this.statements = entryModule.expandAllStatements()
    // console.log('this.statements', this.statements)
    const { code } = this.generate()
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(output, code)
  }
  generate() {
    let bundle = new MagicString.Bundle()
    this.statements.forEach(statement => {
      const source = statement._source.clone();
      /**
       * export const name = '123'
       * ---->
       * const name = '123'
       */
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start)
      }
      bundle.addSource({
        content: source,
        separator: '\n'
      })
    })
    return { code: bundle.toString() }
  }
  /**
   * 根据文件路径获取模块（创建模块实例）
   * @param {*} importee 此模块真实的文件路径（被引入的模块） ./msg.js
   * @param {*} importer 导入此模块的文件路径（引入别的模块的模块） main.js
   * 从importer中引入importee
   */
  fetchModule(importee, importer) {
    let route
    if (!importer) {
      // 根路径
      route = importee
    } else {
      if (path.isAbsolute(importee)) {
        route = importee
      } else {
        route = path.resolve(path.dirname(importer), addSuffix(importee))
      }
    }
    if (route) {
      const code = fs.readFileSync(route, 'utf8')
      const module = new Module({
        code,
        path: route,
        bundle: this,
      })
      this.modules.add(module)
      return module
    }
  }
}
module.exports = Bundle
