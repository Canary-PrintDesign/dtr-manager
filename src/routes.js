const router = require('express').Router()

const { controller } = require('./middleware')

const {
  home,
  report,
  newEntry,
  createEntry,
  apiAgents,
} = require('./controllers')

module.exports = router

router.get('/', controller(home))

router.get('/dtr/report', controller(report))
router.get('/dtr', controller(newEntry))
router.post('/dtr', controller(createEntry))

router.get('/api/agents', controller(apiAgents))
