const debug = require('lib/debug')('http:web:middleware:notFound')

module.exports = notFoundInit

function notFoundInit () {
  return notFound
}

function notFound (req, res, next) {
  if (!res.view) {
    debug({
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body
    })

    res.status(404)
    res.view = '404.pug'
    res.locals = {
      ...req.context,
      title: `Page Not Found - ${req.context.project.name}`
    }
  }

  next()
}
