import path from 'node:path'
import { createFilter, dataToEsm } from '@rollup/pluginutils'
import { type Plugin } from 'rollup'

export interface JsonOptions {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}

export default function json(options?: JsonOptions): Plugin {
  const { include = [/\.json$/], exclude = '' } = options || {}
  // createFilter 返回一个函数，这个函数接受一个id路径参数，返回一个布尔值
  // 这个布尔值表示是否要处理这个id路径
  // rollup 推荐每一个transform类型的插件都需要提供include和exclude选项，生成过滤规则
  const filter = createFilter(include, exclude)

  return {
    name: 'my-json',
    transform: {
      order: 'pre',
      handler(code, id) {
        // console.log(id, !filter(id))
        if (!filter(id) || path.extname(id) !== '.json') {
          return null
        }

        try {
          const parse = JSON.parse(code)
          // console.log(parse, '=====>')

          return {
            code: dataToEsm(parse),
            map: { mappings: '' },
          }
        } catch (error) {
          const message = `不能转换的JSON格式: ${id}`
          this.error({ message, id, cause: error })
          return null
        }
      },
    },
  }
}
