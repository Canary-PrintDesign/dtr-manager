const { OBJECT, UUID, DATE, STRING } = require('../lib/helper-schema.js')
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

  // find and return agents who were present on the last time sheet
  static async getAgentsInLatestReport ({ project, department, date }) {
    const agents = await TimeRecord.query()
      .withGraphJoined('_agent')
      .distinct('timeRecords.agent')
      .where((builder) => {
        if (project) builder.where('timeRecords.project', project)
        if (department) builder.where('timeRecords.department', department)
        if (date) {
          builder.where({ date })
        } else if (department) {
          builder.where(
            'date',
            'in',
            TimeRecord.query()
              .select('date')
              .where('timeRecords.department', department)
              .orderBy('date', 'desc')
              .limit(1),
          )
        }
      })

    return agents.map((agent) => agent._agent)
  }
}
