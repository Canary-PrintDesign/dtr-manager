exports.up = function (knex) {
  return knex.schema.alterTable('departments', (table) => {
    table.boolean('published').default(true)
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('departments', (table) => {
    table.dropColumn('published')
  })
}
