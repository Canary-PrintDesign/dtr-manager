const { create, findAll, findWith, save, schema, serialize, types: t } = require('lib/component')
const Repo = require('./department-repo')

const Schema = schema({
  id: t.guid.optional(),
  project: t.guid.optional(),
  name: t.string.default(''),
  custom: t.bool.default(false)
})

exports.create = async (props = {}) =>
  await create(Schema, props)

exports.findAll = async (project, repo = Repo) =>
  await findAll(repo, exports.create, { project })

exports.findWith = async (props = {}, repo = Repo) =>
  await findWith(repo, exports.create, props)

exports.save = async (props = {}, repo = Repo) =>
  await save(repo, exports.create, await serialize(props))
