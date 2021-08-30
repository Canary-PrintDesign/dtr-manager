const API = require('./api')
const DTR = require('./dtr')
const Home = require('./home')
const Report = require('./report')

module.exports = {
  home: Home.index,
  report: Report.index,
  newEntry: DTR.index,
  createEntry: DTR.create,
  apiAgents: API.requestAgents,
}
