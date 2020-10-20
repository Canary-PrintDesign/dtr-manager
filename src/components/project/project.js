const Repo = require('./project-repo')
const Component = require('lib/component')

exports.create = create
function create () {
  return async (props = {}) => ({
    id: props.id,
    logo: props.logo,
    name: props.name,
    hostname: props.hostname,
    startDate: props.startDate || props.start_date,
    status: props.status || 'unpublished'
  })
}

exports.findWith = (repo = Repo) =>
  async (props = {}) =>
    await Component.findWith(repo, create(), props)

exports.save = (repo = Repo) =>
  async (props = {}) =>
    await Component.save(repo, create(), await serialize(props))

function serialize (props = {}) {
  const data = {
    ...props,
    start_date: props.startDate
  }

  delete data.startDate

  return data
}
