exports.up = function (knex) {
  return knex.schema.createTable('time_records', (table) => {
    table.uuid('id')
    table.uuid('project')
    table.uuid('department')
    table.uuid('agent')

    table.datetime('date')
    table.string('work_start')
    table.string('work_stop')
    table.string('lunch_start')
    table.string('lunch_stop')

    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('time_records')
}
