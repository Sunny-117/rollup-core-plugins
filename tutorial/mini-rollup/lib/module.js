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
    analyse(this.ast, this.code, this);
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
    let result = []
    result.push(statement)
    return result
  }
}
module.exports = Module
