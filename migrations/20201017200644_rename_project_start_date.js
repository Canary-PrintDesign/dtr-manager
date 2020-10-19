exports.up = function (knex) {
  return knex.schema.alterTable('projects', (table) => {
    table.renameColumn('startDate', 'start_date')
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('projects', (table) => {
    table.renameColumn('start_date', 'startDate')
  })
}
