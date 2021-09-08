exports.up = function (knex) {
  return knex.schema.createTable('record_notes', (table) => {
    table.uuid('id').primary()
    table.uuid('project').notNullable()
    table.uuid('department').notNullable()
    table.string('note').nullable()
    table.date('date').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('record_notes')
}
