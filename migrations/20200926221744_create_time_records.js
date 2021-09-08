exports.up = function (knex) {
  return knex.schema.createTable('time_records', (table) => {
    table.uuid('id').primary()
    table.uuid('project').notNullable()
    table.uuid('department').notNullable()
    table.uuid('agent').notNullable()
    table.date('date').notNullable()
    table.string('work_start').notNullable()
    table.string('work_stop').notNullable()
    table.string('lunch_start').notNullable()
    table.string('lunch_stop').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('time_records')
}
