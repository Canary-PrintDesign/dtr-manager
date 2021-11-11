const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('project', S.string().format(S.FORMATS.UUID))
  .prop('department', S.string().format(S.FORMATS.UUID))
  .prop('agent', S.string().format(S.FORMATS.UUID))
  .prop('date', S.string().format(S.FORMATS.DATE))
  .prop('workStart', S.string())
  .prop('workStop', S.string())
  .prop('lunchStart', S.string())
  .prop('lunchStop', S.string())

exports.TimeRecord = class TimeRecord extends Model {
  static get tableName() {
    return 'timeRecords'
  }

  static get jsonSchema() {
    return { ...schema.valueOf(), removeUnused: true }
  }

  static relationMappings = {
    _agent: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'agent',
      join: {
        from: 'timeRecords.agent',
        to: 'agents.id',
      },
    },
  }
}

exports.findWith = findWith

async function findWith({ id, project, department, agent, date }) {
  try {
    return await exports.TimeRecord.query()
      .where((builder) => {
        if (id) builder.where({ id })
        if (department) builder.where({ department })
        if (project) builder.where({ project })
        if (agent) builder.where({ agent })
        if (date) builder.where({ date })
      })
      .limit(1)
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save

async function save(timeRecordProps = {}) {
  try {
    return await exports.TimeRecord.query().insert({ ...timeRecordProps })
  } catch (err) {
    throw new Error(err)
  }
}

// find and return agents who were present on the last time sheet
exports.getAgentsInLatestReport = getAgentsLatestReport
async function getAgentsLatestReport({ project, department, date }) {
  try {
    const agents = await exports.TimeRecord.query()
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
            exports.TimeRecord.query()
              .select('date')
              .where('timeRecords.department', department)
              .orderBy('date', 'desc')
              .limit(1)
          )
        }
      })

    return agents.map((agent) => agent._agent)
  } catch (err) {
    throw new Error(err)
  }
}
