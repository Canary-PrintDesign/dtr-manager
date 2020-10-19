const Agent = require('./agent')

module.exports = {
  create: Agent.create(),
  findAll: Agent.findAll(),
  findWith: Agent.findWith(),
  save: Agent.save()
}
