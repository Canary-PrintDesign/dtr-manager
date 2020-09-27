const debug = require('lib/debug')('http:web:controller:dtr')
const Departments = require('components/departments')
const Project = require('components/project')
const Agents = require('components/agents')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  res.view = 'time-record.pug'
  res.locals = {
    title: 'new'
  }
}
