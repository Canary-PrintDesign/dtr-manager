const debug = require('../../lib/debug')(
  'http:api:middleware:validateAuthToken'
)
const AuthToken = require('../../components/auth-token')

module.exports = () => async (req, res, next) => {
  debug(req.params)

  const token = req.params.token

  if (token) {
    const authToken = await AuthToken.findWith({ token })
    const department = authToken.department
    const authorization = check(authToken)

    console.log(authToken, department, authorization)

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
