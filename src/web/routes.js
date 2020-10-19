const router = require('express').Router()

const {
  controller,
  validateAuthToken
} = require('./middleware')

const {
  home,
  report,
  login,
  newEntry,
  createEntry,
  apiAuthToken,
  apiAgents
} = require('./controllers')

module.exports = router

router.get('/', controller(home))

router.get('/dtr/report', controller(report))
router.get('/dtr', controller(newEntry))
router.post('/dtr', controller(createEntry))

router.get('/login/:token', validateAuthToken(), controller(login))
router.get('/login', validateAuthToken(), controller(login))

router.get('/api/auth-token', controller(apiAuthToken))
router.get('/api/agents', controller(apiAgents))
