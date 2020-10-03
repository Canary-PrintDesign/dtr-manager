const debug = require('lib/debug')('http:web:controller:home')
const Project = require('components/project')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  const project = await getProject(req.hostname)

  res.view = 'home'
  res.locals = {
    project,
    title: `Welcome - ${project.name}`
  }
}

async function getProject (hostname) {
  return await new Project().getBy({ hostname })
}
