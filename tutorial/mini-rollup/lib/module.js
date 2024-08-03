const MagicString = require('magic-string')
const { parse } = require('acorn')
const analyse = require('./ast/analyse')

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code)
    this.path = path
    this.bundle = bundle
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    })
    // 本模块内导入了哪些变量
    this.imports = {}
    // 本模块内导出了哪些变量
    this.exports = {}
    // 存放本模块顶级变量的定义语句是哪条
    this.definitions = {}
    analyse(this.ast, this.code, this);
    console.log('this.imports', this.imports)
    console.log('this.definitions', this.definitions)
  }
  expandAllStatements() {
    let allStatements = []
    this.ast.body.forEach(statement => {
      let statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }
  expandStatement(statement) {
    statement._included = true
    let result = []
    result.push(statement)
    return result
  }
}
module.exports = Module
