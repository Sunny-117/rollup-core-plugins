# build 阶段钩子

## buildStart

Type：(options: InputOptions) => void
Kind：async, parallel
Previous Hook：options
Next Hook：resolveId并行解析每个入口点

- 每次 rollup.rollup build 都要调用此钩子
- 当您需要访问传递给rollup的选项时，建议使用这个钩子
- 因为它考虑了所有 options 钩子的转换，还包含未设置选项的正确默认值

## resolveId

Type：(source, importer) => string
Kind：async, first
Previous Hook：buildStart (如果我们正在解析入口点)， moduleParsed （如果我们正在解析导入），或者作为 resolveDynamicImport 的后备方案。此外，这个钩子可以在构建阶段通过调用插件钩子触发。 emitFile 发出一个入口点，或在任何时候通过调用此。 resolve 可手动解析id
Next Hook：如果解析的 id 尚未加载，则 load ，否则 buildEnd

- 定义自定义解析器
- 解析程序可用于定位第三方依赖关系等。这里 source 是导入语句中所写的导入对象，即
- 来源就是 "../bar.js"

```js
import { foo } from '../bar.js'
```

- importer 是导入模块的完全解析id
- 在解析入口点时， importer 通常是undefined
- 这里的一个例外是通过 this.emitFile 生成的入口点。在这里，您可以提供一个 importer 参数
- 对于这些情况， isEntry 选项将告诉您，我们是否正在解析用户定义的入口点、发出的块，或者是否为此提供了 isEntry 参数。解析上下文函数
- 例如，您可以将其用作为入口点定义自定义代理模块的机制。以下插件将代理所有入口点以注入 polyfill 导入
- 返回 null 将遵循其他 resolveId 函数，最终遵循默认的解析行
- 返回 false 信号，表示源应被视为 外部模块 ，不包括在 bundle 中 `
