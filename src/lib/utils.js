exports.compose = (...fns) => (input) => fns.reduceRight((v, fn) => v.then(fn), Promise.resolve(input))

exports.toString = (data) => Promise.resolve(data).then(res => res.toString())

exports.pipe = function pipe (...fns) {
  return function pipe (input) {
    return fns.reduce((v, fn) => v.then(fn), Promise.resolve(input))
  }
}

exports.pipeWith = function pipe (x, ...fns) {
  return exports.pipe(...fns)(x)
}
