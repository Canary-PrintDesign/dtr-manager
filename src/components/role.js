const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object()
  .prop('id', S.string(S.FORMATS.UUID))
  .prop('role', S.string())

class Role extends Model {
  static get tableName() {
    return 'roles'
  }

  static get jsonSchema() {
    return schema.valueOf()
  }
}

exports.findAll = findAll
async function findAll({ roles } = {}) {
  try {
    return await Role.query().where((builder) => {
      if (roles?.length) builder.whereIn('role', roles)
    })
  } catch (err) {
    throw new Error(err)
  }
}

exports.findWith = findWith
async function findWith({ id, role }) {
  try {
    return await Role.query()
      .where((builder) => {
        if (id) builder.where({ id })
        if (role) builder.where({ role })
      })
      .whereNot({ role: 'super-admin' })
      .limit(1)
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save
async function save(roleProps) {
  try {
    return await Role.query().insert({ ...roleProps })
  } catch (err) {
    throw new Error(err)
  }
}
