exports.up = function (knex) {
  return knex.schema.createTable('agents', (table) => {
    table.uuid('id')
    table.uuid('project')
    table.uuid('department')

    table.string('name')
    table.string('position')

    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('agents')
}
