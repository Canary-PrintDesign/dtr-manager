const debug = require('lib/debug')('http:web:controller:api')
const Department = require('components/department')
const AuthToken = require('components/auth-token')

module.exports = {
  requestAuthToken
}

async function requestAuthToken (req, res) {
  debug('requestAuthToken', req.query)

  const department = await new Department().get(req.query.department)
  const authToken = await new AuthToken({ department: department.id }).save()

  res.data = {
    token: await authToken.token
  }
}
