const app = require('express').Router()

const logRequest = require('./middleware/log-request')
const respond = require('./middleware/respond')
const controller = require('./middleware/controller')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

const { index: home } = require('./controllers/home')
const { index: dtr } = require('./controllers/dtr')

module.exports = app

app.use(logRequest())

app.get('/', controller(home))
app.get('/dtr', controller(dtr))

app.use(notFound())
app.use(respond())

app.use(errorHandler())
