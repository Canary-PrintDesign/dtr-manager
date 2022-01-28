const { OBJECT, UUID, DATE, STRING, NUMBER } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('project', UUID)
  .prop('department', UUID)
  .prop('agent', UUID)
  .prop('date', DATE)
  .prop('workStart', STRING)
  .prop('workStop', STRING)
  .prop('lunchStart', STRING)
  .prop('lunchStop', STRING)
  .prop('order', NUMBER).required()
  .prop('position', STRING).required()

module.exports = class TimeRecord extends Model {
  static tableName = 'time_records'

  static get jsonSchema () {
    return { ...schema.valueOf(), removeUnused: true }
  }

  static relationMappings = {
    _agent: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'agent',
      join: {
        from: 'time_records.agent',
        to: 'agents.id',
      },
    },
  }

  static async findWith ({ id, project, department, agent, date }) {
    return TimeRecord.query()
      .where({
        ...(id && { id }),
        ...(department && { department }),
        ...(project && { project }),
        ...(agent && { agent }),
        ...(date && { date }),
      })
  }

  static async save (timeRecordProps = {}) {
    return TimeRecord.query().insert(timeRecordProps)
  }
}
