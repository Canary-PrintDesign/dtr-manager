const RecordNote = require('./record-note')

module.exports = {
  create: RecordNote.create(),
  findAll: RecordNote.findAll(),
  findWith: RecordNote.findWith(),
  save: RecordNote.save()
}
