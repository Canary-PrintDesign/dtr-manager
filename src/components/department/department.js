const Repo = require('./department-repo')
const Component = require('lib/component')

exports.create = create
function create () {
  return async (props = {}) => ({
    id: props.id,
    name: props.name || '',
    custom: props.custom || false,
    project: props.project
  })
}

exports.findAll = (repo = Repo) =>
  async (project) =>
    await Component.findAll(repo, create(), { project })

exports.findWith = (repo = Repo) =>
  async (props = {}) =>
    await Component.findWith(repo, create(), props)

exports.save = (repo = Repo) =>
  async (props = {}) =>
    await Component.save(repo, create(), await Component.serialize(props))
