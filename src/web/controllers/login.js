const debug = require('lib/debug')('http:web:controller:login')
const Departments = require('components/departments')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  const { project, authorization } = req.context
  const departments = await new Departments()
    .all({ projectId: project.id })
    .then(res => res.map(department => ({ key: department.id, value: department.name })))

  req.context.flash = (authorization === 'valid')
    ? 'Authorized'
    : 'Unauthorized'

  res.view = 'login/index'
  res.locals = {
    ...req.context,
    departments,
    title: 'Login'
  }
}
