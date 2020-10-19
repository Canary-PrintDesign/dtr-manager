const API = require('./api')
const DTR = require('./dtr')
const Home = require('./home')
const Login = require('./login')
const Report = require('./report')

module.exports = {
  home: Home.index,
  report: Report.index,
  login: Login.index,
  newEntry: DTR.index,
  createEntry: DTR.create,
  apiAuthToken: API.requestAuthToken,
  apiAgents: API.requestAgents
}
