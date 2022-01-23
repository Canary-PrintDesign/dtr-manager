exports.up = function (knex) {
  return knex.schema.alterTable('time_records', (table) => {
    table.integer('order')
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('time_records', (table) => {
    table.dropColumn('order')
  })
}
