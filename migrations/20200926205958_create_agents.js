exports.up = function (knex) {
  return knex.schema.createTable('agents', (table) => {
    table.uuid('id').primary()
    table.uuid('project').notNullable()
    table.uuid('department').notNullable()
    table.string('name').notNullable()
    table.string('position').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('agents')
}
