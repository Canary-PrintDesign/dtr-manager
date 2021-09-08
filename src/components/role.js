const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object().prop('id', S.number()).prop('role', S.string())

class Role extends Model {
  static get tableName() {
    return 'roles'
  }

  static get jsonSchema() {
    return schema.valueOf()
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
