const TimeRecord = require('./time-record')

module.exports = {
  create: TimeRecord.create(),
  findWith: TimeRecord.findWith(),
  save: TimeRecord.save(),
}
