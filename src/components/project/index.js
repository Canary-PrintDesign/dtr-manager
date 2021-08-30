const {
  create,
  findWith,
  save,
  schema,
  types: t
} = require('../../lib/component')
const Repo = require('./project-repo')

const Schema = schema({
  id: t.guid.optional(),
  logo: t.string,
  name: t.string,
  hostname: t.string,
  project: t.guid.optional(),
  startdate: t.date,
  status: t.string.default('unpublished')
})

exports.create = async (props = {}) => await create(Schema, props)

exports.findWith = async (props = {}, repo = Repo) =>
  await findWith(repo, exports.create, props)

exports.save = async (props = {}, repo = Repo) =>
  await save(repo, exports.create, await serialize(props))

function serialize (props = {}) {
  const data = {
    ...props,
    start_date: props.startDate
  }

  delete data.startDate

  return data
}
