const Project = require('./project')

module.exports = {
  create: Project.create(),
  findWith: Project.findWith(),
  save: Project.save()
}
