const express = require('express')
const app = express.Router()

const {
  controller,
  errorHandler,
  notFound,
  postProcessLocals,
  project,
  respond
} = require('./middleware')

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

module.exports = app

app.get('/favicon.ico', (_, res) => res.end())

app.use(express.urlencoded({ extended: true }))
app.use(project())

app.get('/', controller(home))
app.get('/dtr/api', controller(dtrAPI))
app.get('/dtr', controller(dtr))
app.post('/dtr', controller(dtrPost))
app.get('/dtr/report/day/:dayNumber', controller(reportGet))
app.get('/dtr/report', controller(reportIndex))

app.use(postProcessLocals())
app.use(notFound())
app.use(respond())

app.use(errorHandler())
