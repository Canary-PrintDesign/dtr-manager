exports.up = function (knex) {
  return knex.schema.createTable('project_notifications', (table) => {
    table.uuid('id').primary()
    table.uuid('project').notNullable()
    table.string('type').defaultTo('primary').notNullable()
    table.text('body').notNullable()
    table
      .enum('status', ['published', 'unpublished'])
      .defaultTo('unpublished')
      .notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('project_notifications')
}
