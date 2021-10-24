const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('project', S.string().format(S.FORMATS.UUID))
  .prop('department', S.string().format(S.FORMATS.UUID))
  .prop('name', S.string())
  .prop('position', S.string())
  .prop('createdAt', S.string().format(S.FORMATS.DATE_TIME))
  .prop('updatedAt', S.string().format(S.FORMATS.DATE_TIME))

class Agent extends Model {
  static get tableName() {
    return 'agents'
  }

  static get jsonSchema() {
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
}

exports.Agent = Agent

exports.findAll = findAll
async function findAll({ project, department, position, name }) {
  try {
    return await Agent.query().where((builder) => {
      if (name) builder.where({ name })
      if (position) builder.where({ position })
      if (project) builder.where({ project })
      if (department) builder.where({ department })
    })
  } catch (err) {
    throw new Error(err)
  }
}

exports.findWith = findWith
async function findWith({ id, project, department, name, position }) {
  try {
    return await Agent.query()
      .where((builder) => {
        if (id) builder.where({ id })
        if (name) builder.where({ name })
        if (project) builder.where({ project })
        if (department) builder.where({ department })
        if (position) builder.where({ position })
      })
      .limit(1)
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save
async function save(agentProps = {}) {
  try {
    return await Agent.query().insert({ ...agentProps })
  } catch (err) {
    throw new Error(err)
  }
}
