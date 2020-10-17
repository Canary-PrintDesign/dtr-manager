const router = require('express').Router()

const { index: home } = require('./controllers/home')

const {
  index: dtr,
  create: dtrPost,
  api: dtrAPI
} = require('./controllers/dtr')

const {
  index: reportIndex,
  get: reportGet
} = require('./controllers/report')

const {
  index: loginIndex
} = require('./controllers/login')

module.exports = router

router.get('/', controller(home))
router.get('/dtr/api', controller(dtrAPI))
router.get('/dtr', controller(dtr))
router.post('/dtr', controller(dtrPost))
router.get('/dtr/report/day/:dayNumber', controller(reportGet))
router.get('/dtr/report', controller(reportIndex))
