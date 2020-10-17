const debug = require('lib/debug')('http:api:middleware:validateAuthToken')
const AuthToken = require('components/auth-token')

module.exports = validateAuthTokenInit

function validateAuthTokenInit () {
  return validateAuthToken
}

async function validateAuthToken (req, res, next) {
  debug(req.params)

  const token = req.params.token

  if (token) {
    const authToken = await new AuthToken().getBy({ token })
    const department = authToken.department
    const authorization = check(authToken)

    req.context = { ...req.context, department, authorization }
  }

  next()
}

function check (authToken) {
  if (!authToken.id) return undefined
  if (authToken.expiryDate <= Date.now) return 'invalid'
  if (authToken.canceled) return 'invalid'

  return 'valid'
}
