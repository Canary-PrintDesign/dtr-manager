const { OBJECT, UUID, STRING } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('role', STRING)

module.exports = class Role extends Model {
  static tableName = 'roles'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static async findAll ({ roles } = {}) {
    return Role.query().where((builder) => {
      if (roles?.length) builder.whereIn('role', roles)
    })
  }

  static async findWith ({ id, role }) {
    return Role.query().where({
      ...(id && { id }),
      ...(role && { role }),
    })
  }

  static async save (roleProps) {
    return Role.query().insert(roleProps)
  }
}
