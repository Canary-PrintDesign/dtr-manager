exports.up = function (knex) {
  return knex.schema.createTable('departments', (table) => {
    table.uuid('id').primary()
    table.uuid('project').nullable()
    table.string('name').notNullable()
    table.boolean('custom').notNullable().default(false)
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('departments')
}
