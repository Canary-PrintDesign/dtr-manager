const Debug = require('debug')

module.exports = function setup (namespace, options) {
  if (options && options.enable) Debug.enable(options.enable)

  return Debug(`dtr:${namespace}:debug`)
}
