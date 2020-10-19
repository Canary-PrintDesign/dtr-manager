const Department = require('./department')

module.exports = {
  create: Department.create(),
  findAll: Department.findAll(),
  findWith: Department.findWith(),
  save: Department.save()
}
