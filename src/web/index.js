const express = require('express')
const app = express.Router()

const routes = require('./routes')
const {
  errorHandler,
  notFound,
  postProcessLocals,
  project,
  respond
} = require('./middleware')

module.exports = app

app.get('/favicon.ico', (_, res) => res.end())
app.use(express.urlencoded({ extended: true }))
app.use(project())

app.use('/', routes)

app.use(postProcessLocals())
app.use(notFound())
app.use(respond())
app.use(errorHandler())
