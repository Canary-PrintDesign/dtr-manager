const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('project', S.anyOf([S.string().format(S.FORMATS.UUID), S.null()]))
  .prop('name', S.string())
  .prop('custom', S.boolean().default(false))

class Department extends Model {
  static get tableName() {
    return 'departments'
  }

  static get jsonSchema() {
    return schema.valueOf()
  }
}

exports.findAll = findAll
async function findAll({ project, name }) {
  try {
    return await Department.query().where((builder) => {
      if (name) builder.where({ name })
      if (project) builder.where({ project }).orWhereNull('project')
    })
  } catch (err) {
    throw new Error(err)
  }
}

exports.findWith = findWith
async function findWith({ id, project, name }) {
  try {
    return await Department.query()
      .where((builder) => {
        if (id) builder.where({ id })
        if (name) builder.where({ name })
        if (project) builder.where({ project })
      })
      .limit(1)
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save
async function save(departmentProps = {}) {
  try {
    return await Department.query().insert({ ...departmentProps })
  } catch (err) {
    throw new Error(err)
  }
}
