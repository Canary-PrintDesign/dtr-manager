exports.up = function (knex) {
  return knex.schema.createTable('record_notes', (table) => {
    table.uuid('id')
    table.uuid('project')
    table.uuid('department')
    table.uuid('record')

    table.string('note')

    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('record_notes')
}
