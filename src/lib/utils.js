// Function Composition

// compose
// create and return a function built up of functions (right to left)
// first function can receive any number of arguments, all other
// functions require a single argument format
exports.compose = (...fns) => {
  return (input) =>
    fns.reduceRight((v, fn) => v.then(fn), Promise.resolve(input))
}

// pipe
// like compose but left to right composition of functions
exports.pipe = (...fns) => {
  return (input) => fns.reduce((v, fn) => v.then(fn), Promise.resolve(input))
}

// pipeWith
// used as a shorthand for pipe, that takes the first argument and
// passes it down, this is equivalent to pipe(...fns)(data)
exports.pipeWith = (x, ...fns) => exports.pipe(...fns)(x)

// inspect
// log data received to stdout and forward data
exports.inspect = (indicator = '>>>') => {
  return (args) => {
    console.info(indicator, { ...args })
    return args
  }
}

// titleCase
// capitalize first character of string
exports.toTitleCase = (word) => word.charAt(0).toUpperCase() + word.slice(1)
