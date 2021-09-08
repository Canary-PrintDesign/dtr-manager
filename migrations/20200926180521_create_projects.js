exports.up = function (knex) {
  return knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary()
    table.string('logo').nullable()
    table.string('name').notNullable()
    table.string('hostname').notNullable()
    table.datetime('start_date').notNullable()
    table
      .enum('status', ['published', 'unpublished'])
      .default('unpublished')
      .notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('projects')
}
