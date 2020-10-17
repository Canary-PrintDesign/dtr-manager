exports.up = function (knex) {
  return knex.schema.createTable('session_tokens', (table) => {
    table.uuid('id')
    table.string('token')
    table.uuid('department')
    table.datetime('expiry_date')
    table.boolean('canceled')

    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('session_tokens')
}
