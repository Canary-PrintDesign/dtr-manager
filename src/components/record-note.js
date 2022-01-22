const { OBJECT, STRING, DATE, UUID } = require('../lib/helper-schema.js')
const { Model } = require('../lib/database.js')

const schema = OBJECT
  .prop('id', UUID)
  .prop('project', UUID)
  .prop('department', UUID)
  .prop('note', STRING)
  .prop('date', DATE)

module.exports = class RecordNote extends Model {
  static tableName = 'recordNotes'

  static get jsonSchema () {
    return schema.valueOf()
  }

  static async findAll ({ project, department, date }) {
    return RecordNote.query().where({
      ...(department && { department }),
      ...(project && { project }),
      ...(date && { date }),
    })
  }

  static async findWith ({ id, project, department, date }) {
    return RecordNote.query()
      .where({
        ...(id && { id }),
        ...(department && { department }),
        ...(date && { date }),
        ...(project && { project }),
      })
  }

  static async save (recordNoteProps = {}) {
    return RecordNote.query().insert(recordNoteProps)
  }
}
