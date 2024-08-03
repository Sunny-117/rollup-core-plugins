const walk = require('./walk')
const Scope = require('./scope')

function analyse(ast, code, module) {
  /**
   * 生成模块的依赖关系
   */
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _module: { value: module }, // 这个语句自己的模块
      _source: { value: code.snip(statement.start, statement.end) }, // 这个语句自己的源码
      _included: { value: false, writable: true }, // 默认不包括在output结果中
      _defines: { value: {} },
      _dependsOn: { value: {} } // 这个语句所依赖的变量
    })
    console.log(statement.type)
    // console.log('读取到的源码：', statement._source.toString())
    /**
     * 导入
     */
    if (statement.type === 'ImportDeclaration') {
      let source = statement.source.value // 导入的模块的相对路径
      // console.log(statement.specifiers)
      statement.specifiers.forEach(specifier => {
        let importName = specifier.imported.name // 导入的变量名
        let localName = specifier.local.name // 当前模块的变量名
        // console.log({ importName, localName })
        module.imports[localName] = { source, importName }
        // module.imports = {
        //   name1: { source: './msg', importName: 'name' },
        //   age: { source: './msg', importName: 'age' }
        // }
      })
    }

    /**
     * 导出
     */
    else if (statement.type === 'ExportNamedDeclaration') {
      const declaration = statement.declaration
      if (declaration && declaration.type === 'VariableDeclaration') {
        const declarations = declaration.declarations
        declarations.forEach(variableDeclarator => {
          const localName = variableDeclarator.id.name
          const exportName = localName
          module.exports[exportName] = { localName, }
        })
      }
    }
  })

  /**
   * 创建作用域链：知道本模块内用到了哪些变量（此变量是局部变量还是全局变量Scope）
   */
  let currentScope = new Scope({ name: '模块内的顶级作用域' })
  ast.body.forEach(statement => {
    function addToScope(name) {
      currentScope.add(name)
      if (!currentScope.parent) {// 顶级作用域
        statement._defines[name] = true //表示此语句定义了一个顶级变量
        module.definitions[name] = statement;//此顶级变量的定义语句就是这条语句
      }
    }
    walk(statement, {
      enter(node) {
        if (node.type === 'Identifier') {
          // 当前这个语句依赖了node.name变量
          statement._dependsOn[node.name] = true
        }
        let newScope
        switch (node.type) {
          case 'FunctionDeclaration':
            addToScope(node.id.name) // 函数本身也是变量，所以也要加入到当前作用域
            const names = node.params.map(it => it.name); // 函数参数名
            // 遇到函数声明，创建新的函数作用域
            newScope = new Scope({ name: node.id.name, parent: currentScope, names })
            break
          case 'VariableDeclaration': // 变量声明
            node.declarations.forEach(declaration => {
              addToScope(declaration.id.name)
            })
            break
          default:
            break
        }
        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope })
        }
      },
      leave(node) {
        // 如果当前节点有_scope属性，说明他创建了一个新的作用域，所以离开的时候，需要将变量从当前作用域移到父级作用域
        if (Object.hasOwnProperty(node, '_scope')) {
          // 离开当前作用域，将变量从当前作用域移到父级作用域
          currentScope = currentScope.parent
        }
      }
    })
  })
  ast.body.forEach(statement => {
    console.log('statement._defines', statement._defines)
  })
}
module.exports = analyse
