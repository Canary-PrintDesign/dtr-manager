const { OBJECT, STRING, UUID, OPTIONAL_UUID, BOOLEAN_FALSE } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('project', OPTIONAL_UUID)
  .prop('name', STRING)
  .prop('custom', BOOLEAN_FALSE)
  .prop('published', BOOLEAN_FALSE)

module.exports = class Department extends Model {
  static tableName = 'departments'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static async findAll ({ project, name } = {}) {
    return Department.query()
      .where((builder) => {
        builder.where({ published: true })
        if (name) builder.where({ name })
      })
      .where((builder) => {
        if (project) builder.where({ project }).orWhereNull('project')
        if (project === null) builder.whereNull('project')
      })
  }

  static async findWith ({ id, project, name } = {}) {
    return Department.query()
      .where((builder) => {
        builder.where({ published: true })
        if (id) builder.where({ id })
        if (name) builder.where({ name })
      })
      .where((builder) => {
        if (project) builder.where({ project }).orWhereNull('project')
      })
  }

  static async save (departmentProps = {}) {
    return Department.query().insert({ ...departmentProps })
  }

  static async remove ({ department, project } = {}) {
    return Department.query()
      .where({ id: department, project })
      .patch({ published: false })
  }
}
