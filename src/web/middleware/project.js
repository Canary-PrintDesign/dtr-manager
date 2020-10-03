const debug = require('lib/debug')('http:api:middleware:project')
const Project = require('components/project')

module.exports = projectInit

function projectInit () {
  return project
}

async function project (req, _res, next) {
  const requestData = {
    method: req.method,
    path: req.path
  }

  debug(requestData)

  try {
    const project = await getProject(req.hostname)
    req.context = { ...req.context, project }
    next()
  } catch (err) {
    next(err)
  }
}

async function getProject (hostname) {
  return await new Project().getBy({ hostname })
}
