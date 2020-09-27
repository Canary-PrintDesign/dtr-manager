exports.up = function (knex) {
  return knex.schema.createTable('projects', (table) => {
    table.uuid('id')

    table.string('logo')
    table.string('name')
    table.datetime('startDate')
    table.enum('status', ['published', 'unpublished'])
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('projects')
}
