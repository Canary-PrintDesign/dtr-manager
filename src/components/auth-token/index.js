const AuthToken = require('./auth-token')

module.exports = {
  create: AuthToken.create(),
  setExpiryDate: AuthToken.setExpiryDate(),
  generateToken: AuthToken.generateToken(),
  save: AuthToken.save(),
  findWith: AuthToken.findWith(),
  expireToken: AuthToken.expireToken()
}
