const { OBJECT, STRING, UUID, STRING_STATUS_UNPUBLISHED } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('project', UUID)
  .prop('type', STRING)
  .prop('body', STRING)
  .prop('status', STRING_STATUS_UNPUBLISHED)

module.exports = class ProjectNotification extends Model {
  static tableName = 'project_notifications'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static async findWith ({ id, project }) {
    return ProjectNotification.query().where({
      ...(id && { id }),
      ...(project && { project }),
      status: 'published',
    })
  }

  static async save (notificationProps = {}) {
    return ProjectNotification.query().insert(notificationProps)
  }

  static async remove ({ notification, project } = {}) {
    return ProjectNotification.query()
      .where({
        id: notification,
        project,
      })
      .patch({ status: 'unpublished' })
  }
}
