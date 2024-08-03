function analyse(ast, code, module) {

  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _module: { value: module }, // 这个语句自己的模块
      _source: { value: code.snip(statement.start, statement.end) }, // 这个语句自己的源码
      _included: { value: false, writable: true }, // 默认不包括在output结果中
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
}
module.exports = analyse
