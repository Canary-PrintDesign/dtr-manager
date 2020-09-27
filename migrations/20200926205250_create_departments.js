exports.up = function (knex) {
  return knex.schema.createTable('departments', (table) => {
    table.uuid('id')
    table.uuid('project')

    table.string('name')
    table.boolean('custom')

    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('departments')
}
