const { UUID, DATE_TIME, OBJECT, STRING } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('project', UUID)
  .prop('department', UUID)
  .prop('name', STRING)
  .prop('position', STRING)
  .prop('createdAt', DATE_TIME)
  .prop('updatedAt', DATE_TIME)

exports.Agent = class Agent extends Model {
  static tableName = 'agents'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static relationMappings = {
    timeRecord: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'time-record',
      join: {
        from: 'agents.id',
        to: 'timeRecords.agent',
      },
    },
  }

  static async findAll ({ name, position, project, department }) {
    return Agent.query().where((builder) => {
      builder.where({
        ...(name && { name }),
        ...(position && { position }),
        ...(project && { project }),
        ...(department && { department }),
      })
    })
  }

  static async save (agentProps = {}) {
    return Agent.query().insert({ ...agentProps })
  }
}
