const Debug = require('debug')

module.exports = (namespace, options) => {
  if (options && options.enable) Debug.enable(options.enable)

  return Debug(`dtr:${namespace}`)
}
