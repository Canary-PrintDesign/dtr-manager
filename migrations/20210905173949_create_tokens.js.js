exports.up = function (knex) {
  return knex.schema.createTable('tokens', (table) => {
    table.uuid('id').primary()
    table.string('token', 6).notNullable().unique()
    table.boolean('is_active').default(true)
    table.uuid('department').notNullable()
    table.uuid('role').notNullable()
    table.uuid('project').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('tokens')
}
