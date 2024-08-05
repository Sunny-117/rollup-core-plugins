function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function addSuffix(path) {
  return path.replace(/\.js$/, '') + '.js'
}


exports.hasOwnProperty = hasOwnProperty
exports.addSuffix = addSuffix
