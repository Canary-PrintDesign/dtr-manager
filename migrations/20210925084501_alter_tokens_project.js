exports.up = function (knex) {
  return knex.schema.alterTable('tokens', (table) => {
    table.uuid('project').nullable().alter()
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('tokens', (table) => {
    table.uuid('project').notNullable().alter()
  })
}
