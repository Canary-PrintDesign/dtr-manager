const debug = require('lib/debug')('http:web:controller:home')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  const { project } = req.context

  res.view = 'home'
  res.locals = {
    ...req.context,
    title: `Welcome - ${project.name}`
  }
}
