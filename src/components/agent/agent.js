const Component = require('lib/component')
const Repo = require('./agent-repo')

exports.create = create
function create () {
  return async (props = {}) => ({
    id: props.id,
    project: props.project,
    department: props.department,
    name: props.name || '',
    position: props.position || ''
  })
}

exports.findAll = (repo = Repo) =>
  async (project, department) =>
    await Component.findAll(repo, create(), { project, department })

exports.findWith = (repo = Repo) =>
  async (props = {}) =>
    await Component.findWith(repo, create(), props)

exports.save = (repo = Repo) =>
  async (props = {}) =>
    await Component.save(repo, create(), await Component.serialize(props))
