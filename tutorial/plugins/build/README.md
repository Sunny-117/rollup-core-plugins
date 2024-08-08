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

## load

Type: (id) => string

Kind: async, first

Previous Hook: 解析加载id的 resolveId 或 resolveDynamicImport 。此外，这个钩子可以在任何时候从插件钩子中通过调用 this.load 来触发预加载与id对应的模块

Next Hook: transform 可在未使用缓存或没有使用相同代码的缓存副本时转换加载的文件，否则应使用 TransformCachedModule

- 定义自定义加载程序
- 返回 null 会推迟到其他加载函数（最终是从文件系统加载的默认行为）
- 为了防止额外的解析开销，例如这个钩子已经使用了这个。parse出于某种原因，为了生成AST，这个钩子可以选择性地返回 {code，AST，map} 对象。 ast 必须是标准的 ESTree ast ，每个节点都有开始和结束属性。如果转换不移动代码，可以通过将map设置为null来保留现有的sourcemaps。否则，您可能需要生成源映射。请参阅关于源代码转换的部分

## transform


Type: (code, id) => string

Kind: async, sequential

Previous Hook: load 当前处理的文件的位置。如果使用了缓存，并且有该模块的缓存副本，那么如果插件为该钩子返回true，则应 shouldTransformCachedModule

Next Hook: moduleParsed 一旦文件被处理和解析，模块就会被解析

- 可用于转换单个模块
- 为了防止额外的解析开销，例如这个钩子已经使用了 this.parse 出于某种原因，为了生成AST
- 这个钩子可以选择性地返回 {code，AST，map} 对象
- ast必须是标准的ESTree ast，每个节点都有 start 和 end 属性
- 如果转换不移动代码，可以通过将map设置为null来保留现有的sourcemaps。否则，您可能需要生成源映射。请参阅关于源代码转换的部分

## shouldTransformCachedModule


Type: ({id, code, ast, resoledSources, moduleSideEffects, syntheticNamedExports) => boolean

Kind: async, first

Previous Hook: load 加载缓存文件以将其代码与缓存版本进行比较的位置

Next Hook: moduleParsed if no plugin returns true, otherwise transform .

- 如果使用了 Rollup 缓存（例如，在监视模式下或通过JavaScript API显式使用），如果在加载钩子之后，加载的代码与缓存副本的代码相同，则Rollup将跳过模块的转换钩子
- 为了防止这种情况，丢弃缓存的副本，而是转换一个模块，插件可以实现这个钩子并返回true。
- 这个钩子还可以用来找出缓存了哪些模块，并访问它们缓存的元信息
- 如果一个插件没有返回true，Rollup将触发其他插件的这个钩子，否则将跳过所有剩余的插件。
