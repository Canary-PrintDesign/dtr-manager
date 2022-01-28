exports.up = function (knex) {
  return knex.schema.alterTable('time_records', (table) => {
    table.text('position')
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('time_records', (table) => {
    table.dropColumn('position')
  })
}
