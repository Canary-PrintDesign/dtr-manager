const { OBJECT, DATE_TIME, STRING, UUID, STRING_STATUS_UNPUBLISHED, URL } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('name', STRING)
  .prop('logo', URL)
  .prop('hostname', STRING)
  .prop('startDate', DATE_TIME)
  .prop('status', STRING_STATUS_UNPUBLISHED)

module.exports = class Project extends Model {
  static tableName = 'projects'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static async findAll () {
    return Project.query()
  }

  static async findWith ({ id, name, hostname, status }) {
    return Project.query()
      .where({
        ...(id && { id }),
        ...(name && { name }),
        ...(hostname && { hostname }),
        ...(status && { status }),
      })
  }

  static async save (projectProps = {}) {
    return Project.query().insert({ ...projectProps })
  }
}
