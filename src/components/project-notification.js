const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('project', S.string().format(S.FORMATS.UUID))
  .prop('type', S.string())
  .prop('body', S.string())
  .prop('status', S.enum(['published', 'unpublished']).default('unpublished'))

class ProjectNotification extends Model {
  static get tableName() {
    return 'project_notifications'
  }

  static get jsonSchema() {
    return schema.valueOf()
  }
}

exports.ProjectNotification = ProjectNotification

exports.findWith = findWith
async function findWith({ id, project }) {
  try {
    return await ProjectNotification.query().where((builder) => {
      if (id) builder.where({ id })
      if (project) builder.where({ project })
      builder.where({ status: 'published' })
    })
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save
async function save(notificationProps = {}) {
  try {
    return await ProjectNotification.query().insert({ ...notificationProps })
  } catch (err) {
    throw new Error(err)
  }
}

exports.remove = remove
async function remove({ notification, project } = {}) {
  try {
    return await ProjectNotification.query()
      .where({ id: notification, project })
      .patch({ status: 'unpublished' })
  } catch (err) {
    throw new Error(err)
  }
}
