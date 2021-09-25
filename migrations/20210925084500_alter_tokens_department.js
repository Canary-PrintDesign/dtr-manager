exports.up = function (knex) {
  return knex.schema.alterTable('tokens', (table) => {
    table.uuid('department').nullable().alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('tokens', (table) => {
    table.uuid('department').notNullable().alter()
  })
}
