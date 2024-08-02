function analyse(ast, code, module) {
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _module: { value: module }, // 这个语句自己的模块
      _source: { value: code.snip(statement.start, statement.end) }, // 这个语句自己的源码
    })
    console.log('读取到的源码：', statement._source.toString())
  })
}
module.exports = analyse