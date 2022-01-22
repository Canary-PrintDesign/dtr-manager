const { randomUUID } = require('crypto')
const { Model, knexSnakeCaseMappers } = require('objection')
const Knex = require('knex')
const connection = require('../../knexfile')
const Path = require('path')

const knex = Knex({
  ...connection,
  ...knexSnakeCaseMappers(),
})

Model.knex(knex)

class BaseModel extends Model {
  static get modelPaths () {
    return [Path.join(__dirname, '..', 'components')]
  }

  async $beforeInsert (queryContext) {
    await super.$beforeInsert(queryContext)

    this.id = randomUUID()
  }

  async $beforeUpdate (queryContext) {
    await super.$beforeInsert(queryContext)

    this.updatedAt = null
  }

  static get pickJsonSchemaProperties () {
    return true
  }
}

module.exports = {
  database: knex,
  Model: BaseModel,
}
