const express = require('express')
const app = express.Router()

// const logRequest = require('./middleware/log-request')
const respond = require('./middleware/respond')
const controller = require('./middleware/controller')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const project = require('./middleware/project')

const { index: home } = require('./controllers/home')
const {
  index: dtr,
  create: dtrPost,
  api: dtrAPI
} = require('./controllers/dtr')

const { index: reportIndex, get: reportGet } = require('./controllers/report')

module.exports = app

// app.use(logRequest())
app.use(express.urlencoded({ extended: true }))
app.get('/favicon.ico', (_, res) => res.end())

app.use(project())
app.get('/', controller(home))
app.get('/dtr/api', controller(dtrAPI))
app.get('/dtr', controller(dtr))
app.post('/dtr', controller(dtrPost))
app.get('/dtr/report/day/:dayNumber', controller(reportGet))
app.get('/dtr/report', controller(reportIndex))

app.use(notFound())
app.use(respond())

app.use(errorHandler())
