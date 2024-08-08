import { createFilter } from 'rollup-pluginutils'
import babel from '@babel/core'

function Babel(options = {}) {
  const { exclude, include, extensions = ['.js', '.jsx'] } = options;
  const extensionRegExp = new RegExp(`(${extensions.join('|')})$`)
  const userDefinedFilter = createFilter(include, exclude);
  const filter = id => extensionRegExp.test(id) && userDefinedFilter(id);
  return {
    name: 'babel-plugin',
    async transform(code, filename) {
      if (!filter(filename)) return null;
      let result = await babel.transformAsync(code, {
        presets: ['@babel/preset-env']
      });
      return result
    }
  }
}
export default Babel
