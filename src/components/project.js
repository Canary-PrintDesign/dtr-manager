const { Model } = require('../lib/database.js')
const S = require('fluent-json-schema')

const schema = S.object()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('name', S.string())
  .prop('logo', S.string().format(S.FORMATS.URL))
  .prop('hostname', S.string())
  .prop('startDate', S.string().format(S.FORMATS.DATE_TIME))
  .prop('status', S.enum(['published', 'unpublished']).default('unpublished'))

class Project extends Model {
  static get tableName() {
    return 'projects'
  }

  static get jsonSchema() {
    return schema.valueOf()
  }
}

exports.findWith = findWith
async function findWith({ id, name, hostname, status }) {
  try {
    return await Project.query()
      .where((builder) => {
        if (id) builder.where({ id })
        if (name) builder.where({ name })
        if (hostname) builder.where({ hostname })
        if (status) builder.where({ status })
      })
      .limit(1)
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save
async function save(projectProps = {}) {
  try {
    return await Project.query().insert({ ...projectProps })
  } catch (err) {
    throw new Error(err)
  }
}
