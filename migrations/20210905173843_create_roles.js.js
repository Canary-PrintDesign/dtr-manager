exports.up = function (knex) {
  return knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary()
    table.string('role').notNullable() // crew admin project-admin super-admin
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('roles')
}
