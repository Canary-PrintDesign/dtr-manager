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
