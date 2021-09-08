const S = require('fluent-json-schema')
const { Model } = require('../lib/database.js')

const schema = S.object()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('project', S.string().format(S.FORMATS.UUID))
  .prop('department', S.string().format(S.FORMATS.UUID))
  .prop('note', S.string())
  .prop('date', S.string().format(S.FORMATS.DATE))

class RecordNote extends Model {
  static get tableName() {
    return 'recordNotes'
  }

  static get jsonSchema() {
    return schema.valueOf()
  }
}

exports.findAll = findAll
async function findAll({ project, department, date }) {
  try {
    return await RecordNote.query().where((builder) => {
      if (department) builder.where({ department })
      if (project) builder.where({ project })
      if (date) builder.where({ date })
    })
  } catch (err) {
    throw new Error(err)
  }
}

exports.findWith = findWith
async function findWith({ id, project, department, date }) {
  try {
    return await RecordNote.query()
      .where((builder) => {
        if (id) builder.where({ id })
        if (department) builder.where({ department })
        if (date) builder.where({ date })
        if (project) builder.where({ project })
      })
      .limit(1)
  } catch (err) {
    throw new Error(err)
  }
}

exports.save = save
async function save(recordNoteProps = {}) {
  try {
    return await RecordNote.query().insert({ ...recordNoteProps })
  } catch (err) {
    throw new Error(err)
  }
}
